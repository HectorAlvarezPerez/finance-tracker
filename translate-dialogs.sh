#!/bin/bash

# Script para traducir múltiples diálogos

# Lista de archivos a traducir
files=(
  "components/transactions/edit-transaction-dialog.tsx"
  "components/transactions/delete-transaction-dialog.tsx"
  "components/accounts/add-account-dialog.tsx"
  "components/accounts/edit-account-dialog.tsx"
  "components/accounts/delete-account-dialog.tsx"
  "components/categories/add-category-dialog.tsx"
  "components/categories/edit-category-dialog.tsx"
  "components/categories/delete-category-dialog.tsx"
)

echo "Files to translate:"
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (not found)"
  fi
done

