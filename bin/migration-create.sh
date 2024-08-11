name="$1"

npx knex migrate:make "$name"

created_migration=$(ls -t ./migrations | head -1)

mv "./migrations/$created_migration" "./migrations/${created_migration%.js}.mjs"

file="./migrations/${created_migration%.js}.mjs"

sed -i '' 's/exports.up = function(knex)/export const up = async (knex) =>/' "${file%}"
sed -i '' 's/exports.down = function(knex)/export const down = async (knex) =>/' "${file%}"

echo "Replaced unnamed function with async lambda in ${file%}"
