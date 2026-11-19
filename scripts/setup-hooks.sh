#!/bin/sh
# このスクリプトを実行すると pre-push フックがインストールされます
# 使い方: sh scripts/setup-hooks.sh

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"
HOOK_FILE="$HOOKS_DIR/pre-push"

cat > "$HOOK_FILE" << 'HOOK'
#!/bin/sh
# pre-push フック: main への直接 push を禁止する

protected_branch="main"

while read local_ref local_sha remote_ref remote_sha; do
    branch=$(echo "$remote_ref" | sed -e 's,.*/\(.*\),\1,')

    if [ "$branch" = "$protected_branch" ]; then
        echo ""
        echo "ERROR: '$protected_branch' ブランチへの直接 push は禁止されています。"
        echo ""
        echo "正しいワークフロー:"
        echo "  1. gh issue create            # Issue を作成"
        echo "  2. git checkout -b feature/{Issue番号}-{内容}"
        echo "  3. git push origin {ブランチ名}"
        echo "  4. gh pr create               # PR を作成"
        echo ""
        exit 1
    fi
done

exit 0
HOOK

chmod +x "$HOOK_FILE"
echo "pre-push フックをインストールしました: $HOOK_FILE"
echo "main への直接 push はブロックされます。"
