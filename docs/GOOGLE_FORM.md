# Google Form + 自動メール送信 セットアップガイド

このガイドでは、Google Formsと連携して、RSVP（出欠確認）の回答時に自動で確認メールを送信する方法を説明します。

## 📋 全体の流れ

1. Google Formを作成
2. Apps Scriptで自動メール送信機能を設定
3. FormのURLとentry番号を取得
4. Next.jsの環境変数を設定
5. テスト送信

---

## 🚀 セットアップ手順

### ステップ1: Google Formを作成

1. [Google Forms](https://forms.google.com/) にアクセス
2. 「新しいフォーム」を作成
3. 以下の質問を追加：

| 質問 | 形式 | 必須 |
|------|------|------|
| お名前 | 記述式 | ✅ |
| メールアドレス | 記述式 | ✅ |
| ご出欠 | ラジオボタン（出席/欠席） | ✅ |
| ご同伴者数 | 記述式 | - |
| アレルギーの有無 | 記述式 | - |
| メッセージ | 段落 | - |

4. **重要**: 「設定」→「回答」→「メールアドレスを収集する」を**オフ**にする
   - （Apps Scriptで独自にメールアドレスを取得するため）

### ステップ2: Apps Scriptを設定

1. Google Formの右上の「︙」→「スクリプトエディタ」をクリック
2. 以下のコードを貼り付け：

```javascript
function onFormSubmit(e) {
  try {
    var response = e.response;
    var itemResponses = response.getItemResponses();
    
    // 回答内容を取得
    var name = '';
    var email = '';
    var attendance = '';
    var guests = '';
    var allergies = '';
    var message = '';
    
    for (var i = 0; i < itemResponses.length; i++) {
      var item = itemResponses[i];
      var question = item.getItem().getTitle();
      var answer = item.getResponse();
      
      if (question.includes('お名前')) name = answer;
      if (question.includes('メールアドレス')) email = answer;
      if (question.includes('ご出欠')) attendance = answer;
      if (question.includes('同伴者')) guests = answer;
      if (question.includes('アレルギー')) allergies = answer;
      if (question.includes('メッセージ')) message = answer;
    }
    
    // メールアドレスの検証
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      Logger.log('Invalid email address: ' + email);
      return;
    }
    
    // メール送信
    var subject = '【確認】結婚式ご出欠のご連絡ありがとうございます';
    var body = createEmailBody(name, attendance, guests, allergies, message);
    
    GmailApp.sendEmail(email, subject, body);
    Logger.log('Email sent successfully to: ' + email);
    
  } catch (error) {
    Logger.log('Error in onFormSubmit: ' + error.toString());
  }
}

function createEmailBody(name, attendance, guests, allergies, message) {
  var body = name + ' 様\n\n';
  body += 'この度は結婚式のご出欠についてご連絡いただき、\n';
  body += '誠にありがとうございます。\n\n';
  body += '以下の内容で承りました。\n\n';
  body += '━━━━━━━━━━━━━━━━━━\n';
  body += '■ ご回答内容\n';
  body += '━━━━━━━━━━━━━━━━━━\n';
  body += 'お名前: ' + name + '\n';
  body += 'ご出欠: ' + attendance + '\n';
  if (guests) body += 'ご同伴者数: ' + guests + '\n';
  if (allergies) body += 'アレルギー: ' + allergies + '\n';
  if (message) body += 'メッセージ: ' + message + '\n';
  body += '━━━━━━━━━━━━━━━━━━\n\n';
  
  if (attendance === '出席') {
    body += '当日、皆様にお会いできることを心より楽しみにしております。\n\n';
    body += '【会場情報】\n';
    body += '日時: 2026年5月5日（火・祝）\n';
    body += '　　　挙式 18:20 | 披露宴 19:10 - 21:25\n';
    body += '会場: The Place of Tokyo\n\n';
    body += '詳細はWeb招待状をご確認ください：\n';
    body += 'https://your-wedding-site.vercel.app\n\n';
  } else {
    body += 'お忙しい中ご連絡いただき、ありがとうございました。\n';
    body += 'またの機会にお会いできることを楽しみにしております。\n\n';
  }
  
  body += '━━━━━━━━━━━━━━━━━━\n\n';
  body += 'ご不明点等ございましたら、\n';
  body += 'このメールに返信する形でお気軽にお問い合わせください。\n\n';
  body += '林恭佑・中野咲希';
  
  return body;
}

// テスト用関数（手動実行してメール送信をテスト）
function testEmail() {
  var testEmail = 'your-test-email@example.com'; // ここに自分のメールアドレスを入力
  var subject = '【テスト】結婚式ご出欠のご連絡ありがとうございます';
  var body = createEmailBody('テスト 太郎', '出席', '1名', 'なし', 'テストメッセージです');
  
  GmailApp.sendEmail(testEmail, subject, body);
  Logger.log('Test email sent to: ' + testEmail);
}
```

3. 「保存」アイコンをクリック（プロジェクト名を適当に付ける）

### ステップ3: トリガーを設定

1. 左メニューの「トリガー」（時計アイコン）をクリック
2. 右下の「トリガーを追加」をクリック
3. 以下のように設定：
   - **実行する関数を選択**: `onFormSubmit`
   - **実行するデプロイを選択**: Head
   - **イベントのソースを選択**: フォームから
   - **イベントの種類を選択**: フォーム送信時
4. 「保存」をクリック
5. Googleアカウントでの承認を求められるので、許可する

### ステップ4: テストメール送信

1. Apps Scriptエディタで `testEmail` 関数を選択
2. コード内の `your-test-email@example.com` を自分のメールアドレスに変更
3. 「実行」ボタンをクリック
4. 承認を求められたら許可
5. メールが届くことを確認

### ステップ5: Form URLとentry番号を取得

1. Google Formの「送信」ボタンをクリック
2. リンクタブを選択してURLをコピー
3. URLを以下の形式に変換：
   ```
   元のURL:
   https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform
   
   変換後（/formResponseに変更）:
   https://docs.google.com/forms/d/e/1FAIpQLSc.../formResponse
   ```

4. **entry番号の取得方法**：
   - Formのプレビューページを開く
   - ブラウザの開発者ツール（F12）を開く
   - 各入力欄を右クリック→「検証」
   - `name="entry.123456789"` のような属性を確認
   - 各質問のentry番号をメモ

例：
```
お名前: entry.123456789
メールアドレス: entry.987654321
ご出欠: entry.111111111
ご同伴者数: entry.222222222
アレルギー: entry.333333333
メッセージ: entry.444444444
```

### ステップ6: Next.jsの環境変数を設定

`.env.local` ファイルに以下を追加：

```bash
# Google Form URL（/formResponseで終わる）
GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
```

### ステップ7: APIルートのentry番号を更新

`app/api/rsvp/route.ts` の該当部分を実際のentry番号に置き換え：

```typescript
formData.append('entry.123456789', body.name) // ← 実際の番号に変更
formData.append('entry.987654321', body.email)
formData.append('entry.111111111', body.attendance)
// ... 以下同様
```

---

## ✅ 動作確認

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで `http://localhost:3000` を開く
3. RSVPフォームから出欠を送信
4. 以下を確認：
   - ✅ Google Formのスプレッドシートに回答が記録されている
   - ✅ 入力したメールアドレスに確認メールが届いている
   - ✅ ターミナルに「Google Form submission successful」と表示

---

## 📊 回答の確認方法

### Google Formsで確認

1. Google Formを開く
2. 「回答」タブをクリック
3. スプレッドシートアイコンをクリックして、全回答をスプレッドシートで管理

### スプレッドシートで管理

- リアルタイムで回答が追加される
- フィルター・並び替え可能
- CSVエクスポート可能
- グラフ作成可能

---

## 🎨 メールテンプレートのカスタマイズ

`createEmailBody` 関数でメール本文をカスタマイズできます：

- 会場情報を変更
- URLを実際のVercel URLに変更
- 新郎新婦の名前を変更
- メッセージの内容を調整

---

## 🔧 トラブルシューティング

### メールが届かない場合

1. **スパムフォルダを確認**
2. **Apps Scriptのログを確認**:
   - エディタの「実行数」→ログを確認
3. **トリガーが正しく設定されているか確認**
4. **Gmailの送信制限**: 1日100通まで（通常は問題なし）

### Google Form送信が失敗する場合

1. GOOGLE_FORM_URLが正しいか確認（/formResponseで終わっているか）
2. entry番号が正しいか確認
3. ブラウザの開発者ツールでネットワークタブを確認

### CORS エラーが出る場合

- 正常な動作です（Google Formはリダイレクトを返すため）
- データは正しく送信されています

---

## 💡 高度な機能

### HTMLメールを送信したい場合

`GmailApp.sendEmail` の代わりに以下を使用：

```javascript
MailApp.sendEmail({
  to: email,
  subject: subject,
  body: body, // プレーンテキスト版
  htmlBody: htmlBody // HTML版
});
```

### 新郎新婦にも通知を送りたい場合

```javascript
// 確認メール送信後に追加
var adminEmail = 'your-email@example.com';
GmailApp.sendEmail(adminEmail, '【新規回答】' + name + '様からの出欠連絡', body);
```

---

## 📝 まとめ

✅ Google Form + Apps Script で完全無料
✅ 自動メール送信
✅ スプレッドシートで管理
✅ データベース不要
✅ 簡単にカスタマイズ可能

これで出欠確認と自動メール送信が完成します！🎉
