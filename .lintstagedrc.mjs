export default {
  '*.ts': ['oxlint --type-aware --fix', 'prettier --write'],
  '*.{json,md,mjs,yml,yaml}': ['prettier --write'],
};
