# Data Visualize Designer

[goandoさんのデータ視覚化のデザイン](https://note.com/goando/m/me00d3667f5ce)を参考に、「正しいグラフ」を作成できるWebアプリケーションです。

## 機能

### グラフ種類
- 横棒グラフ
- 縦棒グラフ
- 折れ線グラフ（複数系列対応）

### カスタマイズ
- **カラーテーマ**: Blue / Green / Purple / Gray / Orange / カスタムカラー
- **配色モード**: 濃淡 / 同色 / 強調
- **画像比率**: 1:1 / 4:3 / 16:9
- **折れ線グラフ専用**: 線のスタイル（直線/曲線）、ラベル表示（終端/凡例）

### エクスポート
- PNG形式でダウンロード
- SVG形式でダウンロード

## 技術スタック

- [Next.js](https://nextjs.org/) 14
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [D3.js](https://d3js.org/)

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いてください。

## ライセンス

MIT
