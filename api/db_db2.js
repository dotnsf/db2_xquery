//. db_db2.js

var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    fs = require( 'fs' ),
    api = express();

require( 'dotenv' ).config();

var Pool = require( 'ibm_db' ).Pool;
var database_url = 'DATABASE_URL' in process.env ? process.env.DATABASE_URL : 'DATABASE=db;HOSTNAME=localhost;UID=db2inst1;PWD=db2inst1;PORT=50000;PROTOCOL=TCPIP'; 

var settings_cors = 'CORS' in process.env ? process.env.CORS : '';
api.all( '/*', function( req, res, next ){
  if( settings_cors ){
    res.setHeader( 'Access-Control-Allow-Origin', settings_cors );
    res.setHeader( 'Vary', 'Origin' );
  }
  next();
});

var pool = null;
if( database_url ){
  console.log( 'database_url = ' + database_url );
  pool = new Pool();
  pool.init( 5, database_url );  //. 5: Pool size
}

api.use( bodyParser.urlencoded( { extended: true } ) );
api.use( bodyParser.json() );
api.use( express.Router() );

//. #2 : Load XML
api.loadXML = async function( xmlfilepath ){
  return new Promise( async ( resolve, reject ) => {
    try{
      if( pool ){
        pool.open( database_url, function( err, conn ){
          if( err ){
            if( conn ){
              conn.close();
            }
            console.log( err );
            resolve( { status: false, error: err } );
          }else{
            var xmlstring = fs.readFileSync( xmlfilepath, 'UTF-8' );
            var sql = 'insert into sample1( xmlval ) values ( ? )';
            conn.query( sql, [ xmlstring ], function( err, result ){
              if( err ){
                conn.close();
                console.log( err );
                resolve( { status: false, error: err } );
              }else{
                conn.close();
                resolve( { status: true, result: result } );
              }
            });
          }
        });
      }else{
        resolve( { status: false, error: 'no connection.' } );
      }
    }catch( e ){
      console.log( e );
      resolve( { status: false, error: err } );
    }finally{
    }
  });
};

//. Add XML
api.createXML = async function( xmlstring ){
  return new Promise( async ( resolve, reject ) => {
    try{
      if( pool ){
        pool.open( database_url, function( err, conn ){
          if( err ){
            if( conn ){
              conn.close();
            }
            console.log( err );
            resolve( { status: false, error: err } );
          }else{
            var sql = 'insert into sample1( xmlval ) values ( ? )';
            conn.query( sql, [ xmlstring ], function( err, result ){
              if( err ){
                conn.close();
                console.log( err );
                resolve( { status: false, error: err } );
              }else{
                conn.close();
                resolve( { status: true, result: result } );
              }
            });
          }
        });
      }else{
        resolve( { status: false, error: 'no connection.' } );
      }
    }catch( e ){
      console.log( e );
      resolve( { status: false, error: err } );
    }finally{
    }
  });
};

//. Read
api.readIds = async function(){
  return new Promise( async ( resolve, reject ) => {
    try{
      if( pool ){
        pool.open( database_url, function( err, conn ){
          if( err ){
            if( conn ){
              conn.close();
            }
            console.log( err );
            resolve( { status: false, error: err } );
          }else{
            var sql = 'select id from sample1';
            conn.query( sql, [], function( err, results ){
              if( err ){
                conn.close();
                console.log( err );
                resolve( { status: false, error: err } );
              }else{
                conn.close();
                if( results && results.length > 0 ){
                  var ids = [];
                  for( var i = 0; i < results.length; i ++ ){
                    ids.push( results[i].ID );
                  }
                  resolve( { status: true, ids: ids } );
                }else{
                  resolve( { status: false, error: 'no data' } );
                }
              }
            });
          }
        });
      }else{
        resolve( { status: false, error: 'no connection.' } );
      }
    }catch( e ){
      console.log( e );
      resolve( { status: false, error: err } );
    }finally{
    }
  });
};

api.readXML = async function( id ){
  return new Promise( async ( resolve, reject ) => {
    try{
      if( pool ){
        pool.open( database_url, function( err, conn ){
          if( err ){
            if( conn ){
              conn.close();
            }
            console.log( err );
            resolve( { status: false, error: err } );
          }else{
            var sql = 'select xmlval from sample1 where id = ?';
            conn.query( sql, [ id ], function( err, results ){
              if( err ){
                conn.close();
                console.log( err );
                resolve( { status: false, error: err } );
              }else{
                conn.close();
                if( results && results.length > 0 ){
                  resolve( { status: true, xml: results[0].XMLVAL } );
                }else{
                  resolve( { status: false, error: 'no data' } );
                }
              }
            });
          }
        });
      }else{
        resolve( { status: false, error: 'no connection.' } );
      }
    }catch( e ){
      console.log( e );
      resolve( { status: false, error: err } );
    }finally{
    }
  });
};

//. XQuery
api.XQuery = async function( xquery ){  //. sample: xquery = '//book[number(price)>0]'
  return new Promise( async ( resolve, reject ) => {
    try{
      if( pool ){
        pool.open( database_url, function( err, conn ){
          if( err ){
            if( conn ){
              conn.close();
            }
            console.log( err );
            resolve( { status: false, error: err } );
          }else{
            var sql = 'select id, xmlquery(\'$XML' + xquery + '\' PASSING xmlval as "XML" ) as result from sample1';
            conn.query( sql, [], function( err, results ){
              if( err ){
                conn.close();
                console.log( err );
                resolve( { status: false, error: err } );
              }else{
                conn.close();
                if( results && results.length > 0 ){
                  for( var i = 0; i < results.length; i ++ ){
                    results[i].RESULT = api.makeResults( results[i].RESULT );
                  }
                  resolve( { status: true, results: results } );
                }else{
                  resolve( { status: false, error: 'no data' } );
                }
              }
            });
          }
        });
      }else{
        resolve( { status: false, error: 'no connection.' } );
      }
    }catch( e ){
      console.log( e );
      resolve( { status: false, error: err } );
    }finally{
    }
  });
};

api.XQueryById = async function( xquery, id ){  //. sample: xquery = '//book[number(price)>0]'
  return new Promise( async ( resolve, reject ) => {
    try{
      if( pool ){
        pool.open( database_url, function( err, conn ){
          if( err ){
            if( conn ){
              conn.close();
            }
            console.log( err );
            resolve( { status: false, error: err } );
          }else{
            var sql = 'select xmlquery(\'$XML' + xquery + '\' PASSING xmlval as "XML" ) as result from sample1 where id = ?';
            conn.query( sql, [ id ], function( err, results ){
              if( err ){
                conn.close();
                console.log( err );
                resolve( { status: false, error: err } );
              }else{
                conn.close();
                if( results && results.length > 0 ){
                  for( var i = 0; i < results.length; i ++ ){
                    results[i].RESULT = api.makeResults( results[i].RESULT );
                  }
                  resolve( { status: true, id: id, results: results } );
                }else{
                  resolve( { status: false, error: 'no data' } );
                }
              }
            });
          }
        });
      }else{
        resolve( { status: false, error: 'no connection.' } );
      }
    }catch( e ){
      console.log( e );
      resolve( { status: false, error: err } );
    }finally{
    }
  });
};


//. Delete
api.deleteXML = async function( id ){
  return new Promise( async ( resolve, reject ) => {
    try{
      if( pool ){
        pool.open( database_url, function( err, conn ){
          if( err ){
            if( conn ){
              conn.close();
            }
            console.log( err );
            resolve( { status: false, error: err } );
          }else{
            if( !id ){
              conn.close();
              resolve( { status: false, error: 'no id.' } );
            }else{
              var sql = 'delete from sample1 where id = ?';
              conn.query( sql, [ id ], function( err, result ){
                if( err ){
                  conn.close();
                  console.log( err );
                  resolve( { status: false, error: err } );
                }else{
                  conn.close();
                  resolve( { status: true, result: result } );
                }
              });
            }
          }
        });
      }else{
        resolve( { status: false, error: 'no connection.' } );
      }
    }catch( e ){
      console.log( e );
      resolve( { status: false, error: err } );
    }finally{
    }
  });
};

api.makeResults = function( xml ){
  var tmp = xml.split( '?>' );
  if( tmp.length > 1 ){
    xml = tmp[0] + '?><Results>' + tmp[1] + '</Results>';
  }

  return xml;
}


api.post( '/xml', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var xml = req.body.xml;
  api.createXML( xml ).then( function( results ){
    res.status( results.status ? 200 : 400 );
    res.write( JSON.stringify( results, null, 2 ) );
    res.end();
  });
});

api.get( '/ids', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  api.readIds().then( function( results ){
    res.status( results.status ? 200 : 400 );
    res.write( JSON.stringify( results, null, 2 ) );
    res.end();
  });
})

api.get( '/xml/:id', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var id = req.params.id ? req.params.id : '';
  api.readXML( id ).then( function( results ){
    res.status( results.status ? 200 : 400 );
    res.write( JSON.stringify( results, null, 2 ) );
    res.end();
  });
})

api.get( '/xquery/:xquery', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var xquery = req.params.xquery ? req.params.xquery : '';
  api.XQuery( xquery ).then( function( results ){
    res.status( results.status ? 200 : 400 );
    res.write( JSON.stringify( results, null, 2 ) );
    res.end();
  });
});

api.get( '/xquery/:xquery/:id', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var xquery = req.params.xquery ? req.params.xquery : '';
  var id = req.params.id ? req.params.id : '';
  api.XQueryById( xquery, id ).then( function( results ){
    res.status( results.status ? 200 : 400 );
    res.write( JSON.stringify( results, null, 2 ) );
    res.end();
  });
});

api.delete( '/xml/:id', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var id = req.params.id ? req.params.id : '';
  api.deleteXML( id ).then( function( results ){
    res.status( results.status ? 200 : 400 );
    res.write( JSON.stringify( results, null, 2 ) );
    res.end();
  });
});


//. api をエクスポート
module.exports = api;
