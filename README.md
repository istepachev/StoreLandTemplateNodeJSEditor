<h1>StoreLand Template NodeJS Editor</h1>
<p>:computer: Сборщик для разработки шаблонов Storeland на локальном диске</p>

#### Порядок работы

- Устанавливаем <a target="_blank" href="//nodejs.org/en/"><strong>Node.js</strong></a> на компьютер (LTS версию)
- Устанавливаем глобально <b>Gulp</b> `npm install -g gulp-cli gulp`
- Устанавливаем зависимости командой `npm install`
- Указываем адрес текущего рабочего сайта в файле `current-site.json`
- Выполняем компанду `node createConfig.js` (создает файл с настройками)
- Заполняем настройки в файле `secret-keys.json`
- Скачиваем файлы шаблона командой: `gulp download`
- Запускаем сборку командой: `gulp`

#### Файл настроек

Имя файла - **current-site.json**

```javascript
{
  "CURRENT_SITE": "https://trialshop.storeland.ru"
}

```

Имя файла - **secret-keys.json**

```javascript
{
    "https://trialshop.storeland.ru": {
        "SECRET_KEY": "d00bcfec8c1eb1ad355fed9fc068e32a"
    },
    "https://trialshop-2.storeland.ru": {
        "SECRET_KEY": "bfec8c1eb1ddsvad355fed9f3vdddvsv3"
    },
}
```

#### Видеоинструкция
