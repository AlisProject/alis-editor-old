# ALIS Editor

## エクスポートされる構造について

ALIS Editor は、内部状態のダンプという形でデータのエクスポートを行います。エクスポートされるデータは、入力フラグや表示用の変換データなどの中間状態の除いた、生のデータのツリー構造となります。

ツリー構造の要素を「ブロック」と呼び、 ALIS Editor は「ブロック」の集まりによって形成されています。ほぼすべてのブロックは、DOM構造のように小ブロックを持つことが出来ますが、現状は利用ケースはごく限られた場合に限定されています。

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

より詳細なデータについては、レポジトリの型定義ファイルを見ることを推奨する。

[https://github.com/AlisProject/alis-editor/blob/master/src/types/Blocks.ts](https://github.com/AlisProject/alis-editor/blob/master/src/types/Blocks.ts)
