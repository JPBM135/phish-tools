for file in ./migrations/*.mjs; do
    # Replace unnamed function with async lambda
    if grep -q "exports.up = function(knex)" "${file%}" || grep -q "exports.down = function(knex)" "${file%}"; then
        echo "Found unnamed function in ${file%}"
    else
        echo "No unnamed function found in ${file%}"
        continue
    fi

    sed -i '' 's/exports.up = function(knex)/export const up = async (knex) =>/' "${file%}"
    sed -i '' 's/exports.down = function(knex)/export const down = async (knex) =>/' "${file%}"

    echo "Replaced unnamed function with async lambda in ${file%}"
done