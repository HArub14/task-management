# 技術スタック

> 要件定義書 → [README.md](../README.md)

---

## 採用技術

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 18.x | UIフレームワーク |
| TypeScript | 5.x | 型安全な開発 |
| Vite | 5.x | ビルドツール・開発サーバー |
| React Router | 6.x | クライアントサイドルーティング |
| TanStack Query | 5.x | サーバー状態管理・APIキャッシュ |
| Axios | 1.x | HTTPクライアント |
| Tailwind CSS | 3.x | スタイリング |

### バックエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Java | 25 (LTS) | プログラミング言語 |
| Spring Boot | 4.1.x | アプリケーションフレームワーク |
| Spring Web | — | REST API |
| Spring Data JPA | — | ORM（Hibernate） |
| Spring Security | — | 認証・認可 |
| JWT（jjwt） | 0.12.x | トークン認証 |
| Lombok | — | ボイラープレート削減 |
| Gradle | 9.x | ビルドツール |

### データベース

| 技術 | バージョン | 用途 |
|------|-----------|------|
| PostgreSQL | 16.x | リレーショナルDB |
| Flyway | 9.x | マイグレーション管理 |

### インフラ・ホスティング

| 技術 | 用途 |
|------|------|
| Docker / Docker Compose | ローカル開発環境 |
| Railway | バックエンドホスティング |
| Vercel | フロントエンドホスティング |

### 開発ツール

| 技術 | 用途 |
|------|------|
| GitHub Actions | CI/CD |
| ESLint / Prettier | フロントエンドコード品質 |
| Checkstyle | Java コード品質 |
| IntelliJ IDEA | バックエンド推奨エディタ |
| VS Code | フロントエンド推奨エディタ |

---

## アーキテクチャ概要

```
[ブラウザ]
    ↓ HTTPS
[React SPA]  ──→  [Spring Boot REST API]  ──→  [PostgreSQL]
(Vite / Vercel)   (Java 25 / Railway)
                          ↑
                   Spring Security + JWT
```

---

## 技術選定の理由

| 技術 | 選定理由 |
|------|---------|
| Java 25 | 最新 LTS。仮想スレッドなど新機能が利用可能 |
| Spring Boot 4.1.x | Java 標準の Web フレームワーク。Spring Data JPA・Security と統合が容易 |
| React 18.x | SPA 構成（Next.js を除外）。コンポーネント指定に合致 |
| Vite | Spring Boot と分離した SPA 開発に最適。高速 HMR |
| TanStack Query | REST API との非同期状態管理をシンプルに実現 |
| Spring Security + JWT | Spring Boot 標準の認証基盤。ステートレス API 認証 |
| Flyway | Spring Boot と統合しやすい DB マイグレーションツール |
| Docker Compose | Java + PostgreSQL のローカル環境を一括管理 |
| Railway | Java アプリのデプロイに対応。PostgreSQL プラグインも提供 |

---

## 開発・実行環境

| 項目 | 内容 |
|------|------|
| Java | 25 (LTS) |
| Gradle | 9.x |
| Node.js | 20.x (フロントエンド開発用) |
| パッケージマネージャー | npm |
| 推奨エディタ（バックエンド） | IntelliJ IDEA |
| 推奨エディタ（フロントエンド） | VS Code |

---

最終更新：2026-11-16
