# Db2 XQuery

## Overview

Sample application which demonstrate XPath and XQuery features in Db2.


## Created table

- sample1
  - `create table sample1( id smallint not null generated always as identity, xmlval xml not null );`


## Inserted data

- `insert into sample1(xmlval) values( '<?xml version="1.0"?><catalog><book id="bk01"><author>Gambardella, Matthew</author><title>XML Developer''s Guide</title><price>44.95</price><publish_date>2000-10-01</publish_date></book><book id="bk02"><author>Ralls, Kim</author><title>Midnight Rain</title><price>5.95</price><publish_date>2000-12-16</publish_date></book></catalog>' );`

- `insert into sample1(xmlval) values( '<?xml version="1.0"?><catalog><book id="bk03"><author>Gambardella, Matthew</author><title>XML Developer''s Guide 2</title><price>20.95</price><publish_date>2001-10-01</publish_date></book><book id="bk04"><author>Kei, KIMURA</author><title>Midnight Rain</title><price>0.95</price><publish_date>1968-11-06</publish_date></book></catalog>' );`


## How to run Db2 on docker

- CLI

  - `$ docker run -d --name db2 -p 50000:50000 --privileged=true -e LICENSE=accept -e DB2INST1_PASSWORD=db2inst1 -e DBNAME=db ibmcom/db2`

  - `$ docker container exec -it db2 bash -c "su - db2inst1"`

  - `$ db2`

  - `db2 => activate database db`

  - `db2 => connecto to db`

  - `db2 => create table sample1( id smallint not null generated always as identity, xmlval xml not null );`

  - `db2 => insert into sample1(xmlval) values( '<?xml version="1.0"?><catalog><book id="bk01"><author>Gambardella, Matthew</author><title>XML Developer''s Guide</title><price>44.95</price><publish_date>2000-10-01</publish_date></book><book id="bk02"><author>Ralls, Kim</author><title>Midnight Rain</title><price>5.95</price><publish_date>2000-12-16</publish_date></book></catalog>' );`

  - `db2 => insert into sample1(xmlval) values( '<?xml version="1.0"?><catalog><book id="bk03"><author>Gambardella, Matthew</author><title>XML Developer''s Guide 2</title><price>20.95</price><publish_date>2001-10-01</publish_date></book><book id="bk04"><author>Kei, KIMURA</author><title>Midnight Rain</title><price>0.95</price><publish_date>1968-11-06</publish_date></book></catalog>' );`


## Environment values

- `DATABASE_URL` : URL connection string for Db2

  - sample: "DATABASE=db;HOSTNAME=localhost;UID=db2inst1;PWD=db2inst1;PORT=50000;PROTOCOL=TCPIP"


## How to run

- `$ git clone https://github.com/dotnsf/db2_xquery`

- `$ cd db2_xquery`

- `$ npm install`

- `$ node app`

- Browse `http://localhost:8080/_doc`


## References

- DB2 XPath functions
  - https://www.ibm.com/docs/ja/i/7.5?topic=xpath-descriptions-functions

- DB2 XPath types
  - https://www.ibm.com/docs/ja/i/7.3?topic=xpath-type-system

- DB2 XQuery
  - https://www.ibm.com/docs/ja/db2/9.7?topic=data-retrieving-db2-xquery-functions
  - https://symfoware.blog.fc2.com/blog-entry-182.html


## Licensing

This code is licensed under MIT.


## Copyright

2024 K.Kimura @ Juge.Me all rights reserved.

