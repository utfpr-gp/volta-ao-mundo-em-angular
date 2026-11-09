private upsert() {
  return this.http.post(PASSPORTS_URL, this.saved()); // sem o Prefer: resolution=merge-duplicates // [!code highlight]
}
