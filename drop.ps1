$command = 'use V'
$drop = 'db.dropDatabase()'

mongosh --quiet --json=relaxed --eval $command --eval $drop
