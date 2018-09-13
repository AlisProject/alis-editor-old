# ALIS Editor

ALIS Editor は、 https://alis.to 向けに作成されているリッチテキストエディタです。

## リンク

- レポジトリ
  - https://github.com/AlisProject/alis-editor
- ドキュメント(このページ)
  - https://alisproject.github.io/alis-editor/
- 動作確認用 Web サイト
  - https://alis-editor-staging.netlify.com/

## ブロックについて

ALIS Editor は、Pure JavaScript Object によって作られたデータの塊をブロックと定義し、ブロックを組み合わせることで文書を作り出します。

ブロックは、入力フラグや表示用の変換データなどの内部向けの状態の除いた、必要なデータのみが存在するオブジェクトです。

すべてのブロックは、DOM構造のように小ブロックを持つことが出来ますが、現状は利用ケースはごく限られた場合に限定されています。


それぞれのブロックの名称と役割は以下となります。

- Text
  - 生のテキストを格納するブロック。 Quote ブロックの中など、任意の HTML が挿入されてほしくない場合に利用する。テストを吐き出す。
- Paragraph
  - リッチテキストを実現するための段落ブロック。内部的には contenteditable が動いていることにより、外部向けには　HTML を吐き出すつくりとなっている。
- Image
  - 画像のためのブロック。 `<img>` タグの alt や src を設定するための情報を吐き出す。
- Quote
  - 引用のためのブロック。内部に Text を持つ。Quote 自体は children しか持っておらず、実体は存在しない。
- Heading
  - 見出しのためのブロック。テキストを吐き出す。
- Rule
  - `<hr>` タグを生成するためのブロック。Rule 自体はデータを持っておらず、実体は存在しない。

より詳細なデータについては、レポジトリの型定義ファイルを見ることを推奨します。

[https://github.com/AlisProject/alis-editor/blob/master/src/types/Blocks.ts](https://github.com/AlisProject/alis-editor/blob/master/src/types/Blocks.ts)

## エクスポートされる構造について

ALIS Editor は内部状態のダンプという形でデータのエクスポートを行います。エクスポートされるデータは、ブロックにより作られた純粋な JavaScript の配列となります。

ALIS Editor は編集のための構造でありレンダリングに関心を持ちません。共通となる構造を基に、レンダラ側でスタイルなどを管理する必要があります。
