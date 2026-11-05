# データベース設計

> 要件定義書 → [README.md](../README.md)

---

## ER図

```
users
  └─< tasks (担当者)
  └─< tasks (作成者)

tasks
  └─< task_comments (コメント ※必要に応じて)
```

> ※ 詳細なER図はFigma/draw.io等で別途管理する場合はリンクをここに記載

---

## テーブル定義

### users（ユーザー）

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | UUID | NOT NULL | gen_random_uuid() | PK |
| email | VARCHAR(255) | NOT NULL | | メールアドレス（UNIQUE） |
| name | VARCHAR(100) | NOT NULL | | 表示名 |
| created_at | TIMESTAMP | NOT NULL | NOW() | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | NOW() | 更新日時 |

---

### tasks（タスク）

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | UUID | NOT NULL | gen_random_uuid() | PK |
| title | VARCHAR(100) | NOT NULL | | タイトル |
| description | TEXT | NULL | | 説明 |
| status | VARCHAR(20) | NOT NULL | 'todo' | todo / in_progress / done |
| priority | VARCHAR(10) | NULL | | high / medium / low |
| due_date | DATE | NULL | | 期限 |
| assignee_id | UUID | NULL | | FK → users.id |
| created_by | UUID | NOT NULL | | FK → users.id |
| created_at | TIMESTAMP | NOT NULL | NOW() | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | NOW() | 更新日時 |

---

### <!-- テーブル名 -->

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| <!-- カラム --> | | | | |

---

## インデックス

| テーブル | カラム | 目的 |
|--------|--------|------|
| tasks | status | ステータスでのフィルタ |
| tasks | assignee_id | 担当者でのフィルタ |
| tasks | due_date | 期限でのソート |

---

最終更新：2026-11-05
