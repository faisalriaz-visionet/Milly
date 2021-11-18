## Getting started

1. Milly the repository and clone it:
```sh
git clone git@github.com:faisalriaz-visionet/Milly.git
cd Milly
```
2. Download theme:
```sh
theme get --password=1234444 --store="staging-milly.myshopify.com" --themeid=1222
```
3. Upload new theme:
```sh
theme new --password=12222 --store="staging-milly.myshopify.com" --name="Add Theme Name"
```
4. Add config.yml:
```sh
staging:
  password: 12333
  theme_id: "1222"
  store: store.myshopify.com
```

5. Watch theme:
```sh
theme watch --env=staging
```

6. Deploy theme:
```sh
theme deploy --allow-live --env=staging
```
