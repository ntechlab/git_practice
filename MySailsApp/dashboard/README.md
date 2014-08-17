# チケットボード（作成中）
###【利用方法（仮）】

１．パッケージインストール<br/>
適宜必要なパッケージをインストールする。<br/>
dashboard直下で、npm installを実行、もしくは、既にダウンロードしたnode_modulesディレクトリをdashboard直下にコピーする。

２．Sails起動<br/>
dashboard直下で以下のコマンドを実行：<br/>
sails lift

３．ユーザー作成<br/>
localhost:1337/user/create?username=ユーザー名&password=パスワード&nickname=ニックネーム<br/>
を実行してユーザーを作成する。

４．ログイン<br/>
localhost:1337/login<br/>
にアクセスしてログインして、ボード作成、チケット作成などの機能を利用する。<br/>
