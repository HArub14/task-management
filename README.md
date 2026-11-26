# TaskManagement

チームのタスクを Kanban ボードで可視化・管理する Web アプリケーション。

---

## 目次

- [概要](#概要)
- [主な機能](#主な機能)
- [技術スタック](#技術スタック)
- [アーキテクチャ](#アーキテクチャ)
- [開発環境セットアップ](#開発環境セットアップ)
- [プロジェクト構成](#プロジェクト構成)
- [ドキュメント一覧](#ドキュメント一覧)
- [非機能要件](#非機能要件)

---

## 概要

| 項目 | 内容 |
|------|------|
| プロジェクト名 | TaskManagement |
| ステータス | 開発中 |
| バックエンド | Spring Boot 4.1.2 (Java 25) |
| フロントエンド | React 18.3.1 + TypeScript 5.6.3 |
| データベース | PostgreSQL 16 |

---

## 主な機能

| # | 機能 | 優先度 |
|---|------|--------|
| F01 | タスク作成（タイトル・説明・担当者・期限・優先度） | Must |
| F02 | タスク編集 | Must |
| F03 | タスク削除（確認ダイアログあり） | Must |
| F04 | タスク一覧表示（優先度・期限でソート） | Must |
| F05 | ステータス変更（未着手 / 進行中 / 完了） | Must |
| F06 | 担当者割り当て | Should |
| F07 | 期限設定 | Should |
| F08 | ユーザー認証（JWT） | Must |
| F09 | ドラッグ&ドロップによる並び替え | Should |

詳細: [docs/feature-list.md](docs/feature-list.md) ｜ [docs/functional-requirements.md](docs/functional-requirements.md)

---

## 技術スタック

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 18.3.1 | UI フレームワーク |
| TypeScript | 5.6.3 | 型安全な開発 |
| Vite | 5.4.11 | ビルドツール・開発サーバー |
| React Router | 6.28.0 | クライアントサイドルーティング |
| TanStack Query | 5.62.3 | サーバー状態管理・API キャッシュ |
| Axios | 1.7.9 | HTTP クライアント |
| Tailwind CSS | 3.4.16 | スタイリング |

### バックエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Java | 25 (LTS) | プログラミング言語 |
| Spring Boot | 4.1.2 | アプリケーションフレームワーク |
| Spring Data JPA | — | ORM（Hibernate） |
| Spring Security | — | 認証・認可 |
| Gradle | 9.8.2 | ビルドツール |

### データベース・インフラ

| 技術 | バージョン | 用途 |
|------|-----------|------|
| PostgreSQL | 16 (alpine) | リレーショナル DB |
| Flyway | (Spring Boot 管理) | DB マイグレーション |
| Docker Compose | — | ローカル開発環境 |

詳細: [docs/tech-stack.md](docs/tech-stack.md)

---

## アーキテクチャ

```
[ブラウザ]
    │ HTTPS
    ▼
[React SPA]  ──────────→  [Spring Boot REST API]  ──→  [PostgreSQL]
(Vite / Vercel)           (Java 25 / Railway)
                                    │
                           Spring Security + JWT
```

- フロント: Vercel にホスティング（SPA）
- バックエンド: Railway にホスティング
- DB: Railway PostgreSQL プラグイン（本番）/ Docker Compose（ローカル）

---

## 開発環境セットアップ

### 前提条件

| ツール | バージョン |
|--------|-----------|
| Java | 25 (LTS) |
| Node.js | 20.x 以上 |
| Docker / Docker Compose | 最新安定版 |

### 1. リポジトリのクローン

```bash
git clone https://github.com/HArub14/Task-management.git
cd Task-management
```

### 2. データベース起動

```bash
docker compose up -d
```

PostgreSQL が `localhost:5432` で起動します。

### 3. バックエンド起動

```bash
cd backend
./gradlew bootRun
```

`http://localhost:8080` で API が起動します。

### 4. フロントエンド起動

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:5173` でアプリが開きます。

---

## プロジェクト構成

```
Task-management/
├── backend/                  # Spring Boot アプリ
│   ├── src/
│   │   ├── main/java/        # ソースコード
│   │   └── main/resources/   # application.yml, DB マイグレーション
│   └── build.gradle.kts
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # UI コンポーネント
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── docs/                     # 要件定義・設計ドキュメント
├── docker-compose.yml        # ローカル PostgreSQL
└── README.md
```

---

## ドキュメント一覧

| ドキュメント | 内容 |
|------------|------|
| [docs/feature-list.md](docs/feature-list.md) | 全機能の一覧と優先度 |
| [docs/functional-requirements.md](docs/functional-requirements.md) | 各機能の詳細仕様 |
| [docs/screen-design.md](docs/screen-design.md) | 画面一覧・操作フロー・画面要件 |
| [docs/database-design.md](docs/database-design.md) | ER 図・テーブル定義 |
| [docs/tech-stack.md](docs/tech-stack.md) | 使用技術・バージョン・選定理由 |

---

## 非機能要件

| 項目 | 要件 |
|------|------|
| パフォーマンス | 一覧表示 2 秒以内 |
| セキュリティ | JWT 認証必須、HTTPS 通信 |
| 対応ブラウザ | Chrome / Safari 最新 2 バージョン |

---

最終更新：2026-11-24
