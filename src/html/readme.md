Названия файлов шаблонов начинаются с `_header.html` и не попадают в итоговую сборку.

В начале шаблона 1й строкой нужно указать файлы, в которые они импортируются. Например:

`<!-- [html.htm, discount_data.htm, goods_list.htm, search.htm] -->`

Внутри шаблона используются переменные в формате

```
{% FOR @@goods_array_name %}

    {% IF @@goods_array_name.IS_NEW %}
        <span class="ico-new">Новинка</span>
    {% ELSEIF @@goods_array_name.IS_TOP %}
        <span class="ico-best">Хит</span>
    {% ENDIF %}
    {% IF @@goods_array_name.MAX_DISCOUNT %}
        <span class="ico-sale">Акция</span>
    {% ENDIF %}

    @@if (inCatalog) {
      <h1>hello</h1>
    }

{% ENDFOR %}`
```

Шаблоны импортируются в основной файл:

`@@include('./\_templates/goods/\_goods.html', {"goods_array_name": "index_page_goods", "inCatalog": true})`

Или так, если не передаются переменные

```
<head>
  @@include('./_templates/_head.html')
</head>
```

Переменные можно задавать прямо в файле или через `_template-variables.js`
Подробнее про применение шаблонов:
[gulp-file-include](https://www.npmjs.com/package/gulp-file-include)
