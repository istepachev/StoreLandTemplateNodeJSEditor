<h1>StoreLand Template NodeJS Editor</h1>
<p>:computer: Сборщик для разработки шаблонов Storeland на локальном диске</p>

#### Порядок работы

- Устанавливаем <a target="_blank" href="//nodejs.org/en/"><strong>Node.js</strong></a> на компьютер (LTS версию)
- Устанавливаем глобально <b>Gulp</b> `npm install -g gulp-cli gulp`
- Устанавливаем зависимости командой `npm install`
- Указываем адрес текущего рабочего сайта в файле `current-site.json`
- Выполняем команду `node createConfig.js` (создает файл с настройками)
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

- Проверьте протокол **https://** или **http://** используется у рабочего сайта

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

#### Структура проекта

```
🗂 project/
├──── 🗂 dist/ - директория для скомпилированных файлов проекта
├──── 🗂 downloaded-files/ - директория загруженных файлов проекта
├──── 🗂 node-modules/ - директория для node-модулей
└──┬─ 🗂 src/ - директория для исходных файлов проекта
   ├──┬─ 🗂 html/ - директория для страниц и компонентов
   │  └─── 🗂 _templates/ - директория для типовых блоков страницы, таких как хедер, футер и т.п.
   │  └─── _template-variables.js - файл с глобальными переменными для шаблонов
   ├──── 🗂 fonts/ - директория для шрифтов
   ├──── 🗂 images/ - директория для изображений
   ├──┬─ 🗂 js/ - директория для файлов JavaScript
   │  └─── 🗂 default/ - директория для базовых js скриптов, которые мы изменять не будем
   ├──┬─ 🗂 scss/ - директория для файлов стилей
   │  └─── 🗂 default/ - директория для базовых css стилей, которые мы изменять не будем
   │  └─── 🗂 templates/ - директория для шаблонов scss файлов стилей, таких как _header, _footer и т.п.
   └──── 🗂 icons/ - директория для файлов иконок SVG
```

#### Видеоинструкция
