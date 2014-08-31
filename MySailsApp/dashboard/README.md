# 付箋アプリ（仮）（作成中）
###【利用方法（仮）】

１．パッケージインストール<br/>
適宜必要なパッケージをインストールする。<br/>
dashboard直下で、npm installを実行、もしくは、既にダウンロードしたnode_modulesディレクトリをdashboard直下にコピーする。

２．Sails起動<br/>
dashboard直下で以下のコマンドを実行：<br/>

developmentモードで起動する場合：<br/>
sails lift<br/>
（.tmpディレクトリ内にDBデータが格納されます。）<br/>

productionモードで起動する場合：<br/>
sails lift --prod<br/>
（この場合、別途mongodbが起動している必要があります。下記、【mongodbの準備と利用方法】を参照。）<br/>

３．ユーザー作成<br/>
localhost:1337/user/create?username=ユーザー名&password=パスワード&nickname=ニックネーム<br/>
を実行してユーザーを作成する。

４．ログイン<br/>
localhost:1337/login<br/>
にアクセスしてログインして、ボード作成、チケット作成などの機能を利用する。<br/>

###【mongodbの準備と利用方法】

#### 準備（productionモードで実行する場合にのみ必要）
１．mongodbのzip版をダウンロードして適当な場所に展開し、binフォルダをPATHに追加する。

２．mongodbのデータ格納フォルダを作成する。

３．以下のコマンドでmongodbを起動する：<br/>
mongod --dbpath （データ格納フォルダパス）

#### 利用方法

１．mongodbクライアントを起動する。<br/>
mongo

２．利用するDBを選択：<br/>
use sails

３．コマンドの例<br/>
以下のコマンドでticketコレクションのリストを表示<br/>
db.ticket.find()<br/>

以下のコマンドでticketコレクションにデータをインサート：<br/>
db.ticket.insert({name:'name01', message:'MESSAGE01', ...});


