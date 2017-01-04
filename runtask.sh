cd `dirname $0`
DIR=`pwd`
if [ "$1" == "tests" ]
then
  cd $DIR/tests
  node node_modules/mocha/bin/mocha -t 999999 built/ -g "$2"
else 
  cd $DIR/client
  npm run $@
fi

