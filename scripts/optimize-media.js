/**
 * メディア最適化スクリプト
 * 
 * 使い方:
 * npm run optimize-media
 * 
 * 機能:
 * 1. public/images/raw 配下の画像を最適化して public/images/optimized に出力
 *    - WebP形式に変換
 *    - 最大幅 1920px にリサイズ
 * 
 * 2. public/videos/raw 配下の動画を最適化して public/videos/optimized に出力
 *    - 1080p MP4 (H.264) に変換
 *    - 720p MP4 (H.264) に変換 (モバイル用)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const DIRS = {
    images: {
        input: path.join(__dirname, '../public/images/raw'),
        output: path.join(__dirname, '../public/images/optimized'),
    },
    videos: {
        input: path.join(__dirname, '../public/videos/raw'),
        output: path.join(__dirname, '../public/videos/optimized'),
    },
};

// ディレクトリ作成
Object.values(DIRS).forEach(dir => {
    if (!fs.existsSync(dir.input)) {
        console.log(`📁 作成: ${dir.input}`);
        fs.mkdirSync(dir.input, { recursive: true });
    }
    if (!fs.existsSync(dir.output)) {
        console.log(`📁 作成: ${dir.output}`);
        fs.mkdirSync(dir.output, { recursive: true });
    }
});

async function optimizeImages() {
    console.log('\n🖼️  画像の最適化を開始...');
    const files = fs.readdirSync(DIRS.images.input, { recursive: true }).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

    if (files.length === 0) {
        console.log('  → 対象ファイルがありません');
        return;
    }

    for (const file of files) {
        // recursive: true の場合、file はサブディレクトリを含むパスになる可能性があるが、
        // fs.readdirSync(..., { recursive: true }) は Node v20.1.0+ でサポート。
        // 環境によってはフラットなリストか、再帰的取得が必要。
        // ここでは簡易的にフラットな構造、もしくはサブディレクトリ対応を自前でやるのが安全だが、
        // ユーザー要件は「raw配下に配置」なので、一旦フラットまたは再帰対応を試みる。
        // Nodeのバージョンが不明確なため、再帰探索関数を定義するのが確実。

        // とりあえず単純化のため、サブディレクトリ構造を維持して出力するようにする。
        // ここでは fs.readdirSync(..., { recursive: true }) が使えると仮定せず、
        // glob的な挙動が必要だが、依存を増やしたくないので、
        // 簡易的な再帰関数を使う。
    }
}

// 再帰的にファイルを取得する関数
function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

async function processImages() {
    console.log('\n🖼️  画像の最適化を開始...');
    const files = getFiles(DIRS.images.input).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

    if (files.length === 0) {
        console.log('  → 対象ファイルがありません');
        return;
    }

    for (const inputPath of files) {
        const relativePath = path.relative(DIRS.images.input, inputPath);
        const outputPath = path.join(DIRS.images.output, relativePath.replace(/\.[^.]+$/, '.webp'));
        const outputDir = path.dirname(outputPath);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // 既に存在し、更新日時が新しい場合はスキップ
        if (fs.existsSync(outputPath)) {
            const inputStat = fs.statSync(inputPath);
            const outputStat = fs.statSync(outputPath);
            if (outputStat.mtime > inputStat.mtime) {
                // console.log(`  ⏭️  スキップ: ${relativePath}`);
                continue;
            }
        }

        console.log(`  ⚙️  処理中: ${relativePath}`);
        try {
            await sharp(inputPath)
                .resize(1920, null, { withoutEnlargement: true }) // 最大幅1920px
                .webp({ quality: 80 })
                .toFile(outputPath);
            console.log(`  ✅ 完了: ${relativePath} -> .webp`);
        } catch (err) {
            console.error(`  ❌ エラー: ${relativePath}`, err.message);
        }
    }
}

function processVideos() {
    console.log('\n🎬 動画の最適化を開始...');
    const files = getFiles(DIRS.videos.input).filter(f => /\.(mp4|mov|avi)$/i.test(f));

    if (files.length === 0) {
        console.log('  → 対象ファイルがありません');
        return;
    }

    for (const inputPath of files) {
        const relativePath = path.relative(DIRS.videos.input, inputPath);
        const baseName = path.basename(inputPath, path.extname(inputPath));
        const outputDir = path.join(DIRS.videos.output, path.dirname(relativePath));

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // 1080p
        const output1080p = path.join(outputDir, `${baseName}-1080p.mp4`);
        if (!fs.existsSync(output1080p) || fs.statSync(output1080p).mtime < fs.statSync(inputPath).mtime) {
            console.log(`  ⚙️  1080p生成中: ${relativePath}`);
            try {
                execSync(`ffmpeg -i "${inputPath}" -vf "scale=-2:1080" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -y "${output1080p}"`, { stdio: 'ignore' });
                console.log(`  ✅ 完了: 1080p`);
            } catch (err) {
                console.error(`  ❌ エラー(1080p): ${relativePath}`);
            }
        }

        // 720p (Mobile)
        const output720p = path.join(outputDir, `${baseName}-720p.mp4`);
        if (!fs.existsSync(output720p) || fs.statSync(output720p).mtime < fs.statSync(inputPath).mtime) {
            console.log(`  ⚙️  720p生成中: ${relativePath}`);
            try {
                execSync(`ffmpeg -i "${inputPath}" -vf "scale=-2:720" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 96k -y "${output720p}"`, { stdio: 'ignore' });
                console.log(`  ✅ 完了: 720p`);
            } catch (err) {
                console.error(`  ❌ エラー(720p): ${relativePath}`);
            }
        }
    }
}

(async () => {
    try {
        await processImages();
        processVideos();
        console.log('\n✨ 全ての処理が完了しました');
    } catch (err) {
        console.error('予期せぬエラーが発生しました:', err);
        process.exit(1);
    }
})();
