# コード品質レビュー チェックリスト

このスキルは `/quality-review` で呼び出せるコードレビューチェックリストです。
Spring Boot + React プロジェクトの品質レビュー時に参照してください。

---

## バックエンド（Spring Boot / Java）

### 1. N+1クエリ
- [ ] `@ManyToOne(fetch = FetchType.LAZY)` を持つエンティティの一覧取得に `@EntityGraph` または `JOIN FETCH` が付いているか
- [ ] `findAll()` やフィルター系クエリメソッドすべてに対して確認する

### 2. 入力バリデーション
- [ ] `build.gradle.kts` に `spring-boot-starter-validation` が含まれているか
- [ ] コントローラーの `@RequestBody` 引数に `@Valid` が付いているか
- [ ] DTO/Record の必須フィールドに `@NotBlank` / `@NotNull` が付いているか

### 3. 統一エラーレスポンス
- [ ] `@RestControllerAdvice` のクラスが存在するか
- [ ] `ResponseStatusException` を `{"error": "..."}` の形式に変換しているか
- [ ] `MethodArgumentNotValidException` を `{"error": "Validation failed", "details": {...}}` に変換しているか

### 4. 認証情報の外部化
- [ ] `application.yml` の `datasource.url/username/password` が `${ENV_VAR:default}` 形式か
- [ ] `show-sql: true` が本番環境でも有効にならないよう `${SHOW_SQL:false}` になっているか

### 5. エンティティの @Column 制約
- [ ] DB のカラム長と `@Column(length = ...)` が一致しているか
- [ ] NOT NULL カラムに `@Column(nullable = false)` が付いているか

### 6. デッドコード
- [ ] アノテーション・メソッドのない空クラスが存在しないか
- [ ] 未使用の import がないか（Checkstyle `UnusedImports` ルールで検出）

### 7. Checkstyle
- [ ] `checkstyle` プラグインが `build.gradle.kts` に追加されているか
- [ ] `./gradlew checkstyleMain` がエラー 0 件で通るか

---

## フロントエンド（React / TypeScript）

### 1. ESLint 設定
- [ ] `eslint.config.js`（ESLint 9 フラットコンフィグ）が存在するか
- [ ] `package.json` の `scripts` に `"lint": "eslint src --max-warnings 0"` があるか
- [ ] `npm run lint` がエラー 0 件で通るか

### 2. 型安全性
- [ ] `Record<string, number>` → ユニオン型 `Record<TaskPriority, number>` のような具体型になっているか
- [ ] `as` によるキャストの前後に null ガードがあるか
- [ ] `@typescript-eslint/no-explicit-any: error` ルールで `any` が禁止されているか

### 3. アクセシビリティ（jsx-a11y）
- [ ] すべての `<label>` に `htmlFor` があり、対応する input/select/textarea に `id` が付いているか
- [ ] ドロップダウン等に `aria-label` または visible label が付いているか

### 4. API エラーハンドリング
- [ ] `useMutation` から返る `isError` が全操作（create/update/delete）で表示されているか
- [ ] 削除確認ダイアログ内にも削除エラーメッセージが表示されるか

### 5. 環境変数
- [ ] `axios` の `baseURL` にハードコードの URL がないか（`import.meta.env.VITE_API_URL` 等を使用）

### 6. interface 命名
- [ ] コンポーネントの Props 型が汎用名 `Props` ではなくファイル固有名（`CreateTaskModalProps` 等）になっているか

### 7. null ガード
- [ ] `document.getElementById('root')!` のような非null断言を使わず、明示的な null チェックをしているか

---

## 参照情報

このチェックリストは Issue #15（chore: Lint導入・コード品質修正・ドキュメント更新）の対応内容をもとに作成しました。

更新日：2026-11-27
