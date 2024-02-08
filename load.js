//. load.js
var db = require( './api/db_db2' );

function show_usage(){
  console.log( 'Usage: $ node load <xmlfilepath>' );
}


try{
  if( process.argv.length > 2 ){
    var xmlfilepath = process.argv[2];
    db.loadXML( xmlfilepath ).then( function( result ){
      console.log( {result} );
    });
  }else{
    show_usage();
  }
}catch( e ){
  console.log( e );
}

