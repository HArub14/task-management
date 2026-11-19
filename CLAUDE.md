# Claude Code 開発ルール

このファイルに記載されたルールは **すべての作業において厳守** すること。
例外なく、いかなる変更・追加・修正においても以下の手順に従うこと。

---

## 必須ワークフロー

### ステップ 1: Issue を先に作る

**コード変更・機能追加・バグ修正・ドキュメント更新のいかなる作業も、GitHub Issue を先に作成すること。**

```bash
gh issue create --title "[種別] 作業内容" --body "## 背景\n\n## やること\n\n## 受け入れ条件\n- [ ] "
```

Issue 番号を必ず控えること（ブランチ名・PR に使用する）。

---

### ステップ 2: ブランチを作る

**main ブランチへの直接コミット・push は絶対に禁止。**

```bash
git checkout -b {prefix}/{Issue番号}-{内容（英語・ハイフン区切り）}
```

#### ブランチ命名規則

| 種別 | プレフィックス | 例 |
|------|--------------|-----|
| 機能追加 | `feature/` | `feature/42-add-task-filter` |
| バグ修正 | `fix/` | `fix/15-fix-login-error` |
| ドキュメント | `docs/` | `docs/8-update-api-spec` |
| リファクタリング | `refactor/` | `refactor/22-extract-task-service` |
| テスト追加 | `test/` | `test/30-add-task-unit-tests` |
| 設定・インフラ | `chore/` | `chore/5-setup-docker` |

---

### ステップ 3: コミットする

Conventional Commits 形式でコミットメッセージを書くこと。

```
{type}: {変更内容の要約}

{詳細（任意）}
```

| type | 用途 |
|------|------|
| `feat` | 機能追加 |
| `fix` | バグ修正 |
| `docs` | ドキュメント |
| `refactor` | リファクタリング |
| `test` | テスト |
| `chore` | 設定・インフラ |

---

### ステップ 4: Pull Request を作る

```bash
git push origin {ブランチ名}
gh pr create --title "{type}: {変更内容の要約} #{Issue番号}" --body "..."
```

**PR に必須の要素：**
- タイトル末尾に `#Issue番号`（例: `feat: タスクフィルター機能を追加 #42`）
- ボディに `Closes #42`（マージ時に Issue が自動クローズされる）

---

## 禁止事項

| 禁止 | 理由 |
|------|------|
| `git push origin main` | main への直接 push 禁止 |
| Issue なしで作業開始 | トレーサビリティの確保 |
| PR なしで main にマージ | レビュープロセスを通すため |
| `git push --force` | 履歴の破壊防止 |

---

## 一連のワークフロー（まとめ）

```
1. gh issue create          # Issue を作成
2. gh issue list            # Issue 番号を確認
3. git checkout -b feature/{番号}-{内容}  # ブランチ作成
4. （実装・コミット）
5. git push origin feature/{番号}-{内容}
6. gh pr create             # PR を作成（Closes #番号 を含める）
7. gh pr merge              # マージ
```
