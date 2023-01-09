/*
 * lazy loads elements with default selector as '.lozad'
 */
$(function () {
  lozad().observe();
});
/*
 * Fancybox default
 */
$.extend($.fancybox.defaults, {
  closeBtn: true,
  helpers: {
    overlay: {
      css: { background: "rgba(76, 76, 76, 0.8)" },
      locked: false,
    },
  },
});
$.extend($.fancybox.defaults.tpl, {
  closeBtn: '<a title="Закрыть" class="fancybox-item fancybox-close" href="javascript:;"></a>',
  next: '<a title="Далее" class="fancybox-nav fancybox-next" href="javascript:;"><span class="fal fa-angle-right"></span></a>',
  prev: '<a title="Назад" class="fancybox-nav fancybox-prev" href="javascript:;"><span class="fal fa-angle-left"></span></a>',
});
/*
 * Noty default
 */
Noty.overrideDefaults({
  layout: "bottomRight",
  theme: "sunset",
  timeout: "3000",
  killer: true,
  progressBar: true,
  animation: {
    open: "animated bounceInRight",
    close: "animated bounceOutRight",
  },
});

// Возвращает правильное окончание для слова
function genWordEnd(num, e, m, mm) {
  // Если забыли указать окончания
  if (typeof e == "undefined") {
    e = "";
  }
  if (typeof m == "undefined") {
    e = "а";
  }
  if (typeof mm == "undefined") {
    e = "oв";
  }
  // Если передали пустую строку, вместо цифры
  if (0 == num.length) {
    num = 0;
  }
  // Превращаем цифру в правильный INT
  num = GetSum(num).toString();
  // Получаем последний символ цифры
  ch1 = num.substring(num.length - 1);
  // Получаем последний символ цифры
  ch2 = num.length == 1 ? 0 : num.substring(num.length - 2, num.length - 1);
  // Если последняя цифра - 1, вернем единственное число
  if (ch2 != 1 && ch1 == 1) {
    return e;
  }
  // Если последняя цифра - от 2 до 4х , вернем множественное чило из массива с индексом 2
  else if (ch2 != 1 && ch1 > 1 && ch1 <= 4) {
    return m;
  }
  // Если последняя цифра - от 5 до 0 , вернем множественное чило из массива с индексом 3
  else if (ch2 == 1 || ch1 > 4 || ch1 == 0) {
    return mm;
  }
}

// Считает сумму  33 599,65 + 2000 - 1910-41,6
function GetSum(val, precision) {
  if (typeof precision == "undefined" || precision < 0) {
    precision = 0;
  }
  // Возводим в степень точности 10 для округления
  var p = Math.pow(10, precision);
  try {
    return (
      Math.round(parseFloat(eval(val.toString().replace(/\s/gi, "").replace(/,/gi, "."))) * p) / p
    );
  } catch (e) {
    return 0;
  }
}

// Форматирует цену
function number_format(n, e, t, r) {
  var i = n,
    a = e,
    o = function (n, e) {
      var t = Math.pow(10, e);
      return (Math.round(n * t) / t).toString();
    };
  (i = isFinite(+i) ? +i : 0), (a = isFinite(+a) ? Math.abs(a) : 0);
  var u,
    d,
    f = "undefined" == typeof r ? "," : r,
    h = "undefined" == typeof t ? "." : t,
    l = a > 0 ? o(i, a) : o(Math.round(i), a),
    s = o(Math.abs(i), a);
  s >= 1e3
    ? ((u = s.split(/\D/)),
      (d = u[0].length % 3 || 3),
      (u[0] = l.slice(0, d + (0 > i)) + u[0].slice(d).replace(/(\d{3})/g, f + "$1")),
      (l = u.join(h)))
    : (l = l.replace(".", h));
  var c = l.indexOf(h);
  return (
    a >= 1 && -1 !== c && l.length - c - 1 < a
      ? (l += new Array(a - (l.length - c - 1)).join(0) + "0")
      : a >= 1 && -1 === c && (l += h + new Array(a).join(0) + "0"),
    l
  );
}
// Добавляет пробел 1000 -> 1 000  /  10000 -> 10 000
function addSpaces(nStr) {
  return nStr.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
}
// Проверка вводимых значений в количестве товара
function keyPress(oToCheckField, oKeyEvent) {
  return oKeyEvent.charCode === 0 || /\d/.test(String.fromCharCode(oKeyEvent.charCode));
}

// Функция определения браузера
$(function () {
  var user = detect.parse(navigator.userAgent);
  if (user.browser.family === "Safari") {
    $("body").addClass("Safari");
  }
  if (user.browser.family === "IE") {
    $("body").addClass("IE");
  }
  if (user.browser.family === "Firefox") {
    $("body").addClass("Firefox");
  }
  if (user.browser.family === "Opera") {
    $("body").addClass("Opera");
  }
  if (user.browser.family === "Chrome") {
    $("body").addClass("Chrome");
  }
});

// Функция определения ширины экрана пользователя
function getClientWidth() {
  return document.compatMode == "CSS1Compat" && !window.opera
    ? document.documentElement.clientWidth
    : document.body.clientWidth;
}

// Работа с cookie файлами.
// Получение переменной из cookie
function getCookie(name) {
  var matches = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Установка переменной в cookie
function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

// Удаление переменной из cookie
function deleteCookie(name, options) {
  options = options || {};
  options.expires = -1;
  setCookie(name, "", options);
}

// Отправляет ошибку на сервер, для того чтобы служба тех поддержки могла разобраться в проблеме как можно быстрее.
function sendError(desc, page, line) {
  var img = document.createElement("img");
  img.src =
    "https://storeland.ru/error/js?desc=" +
    encodeURIComponent(desc) +
    "&page=" +
    encodeURIComponent(window.location) +
    "&line=0";
  img.style.position = "absolute";
  img.style.top = "-9999px";
  try {
    document.getElementsByTagName("head").appendChild(img);
  } catch (e) {}
  return false;
}

// Превращает поле пароля в текстовое поле и обратно
// @LinkObject - ссылка по которой кликнули
// @InputObject - объект у которого нужно изменить тип поля
function ChangePasswordFieldType(LinkObject, InputObject) {
  var // Ссылка по которой кликнули
    LObject = $(LinkObject),
    // Объект у которого изменяем тип с password на text
    IObject = $(InputObject),
    // Старый текст ссылки
    txtOld = LObject.html(),
    // Новый текст ссылки
    txtNew = LObject.attr("rel");
  // Если объекты не получены, завершим работу функции
  if (LObject.length == 0 || IObject.length == 0) {
    return false;
  }
  // Изменяем у ссылки текст со старого на новый
  LObject.html(txtNew);
  // Старый текст ссылки сохраняем в атрибуте rel
  LObject.attr("rel", txtOld);
  // Изменяем тип input поля
  if (IObject[0].type == "text") {
    IObject[0].type = "password";
  } else {
    IObject[0].type = "text";
  }
}

// Крутит изображение при обновлении картинки защиты от роботов
function RefreshImageAction(img, num, cnt) {
  if (cnt > 13) {
    return false;
  }
  $(img).attr("src", $(img).attr("rel") + "icon/refresh/" + num + ".gif");
  num = num == 6 ? 0 : num;
  setTimeout(function () {
    RefreshImageAction(img, num + 1, cnt + 1);
  }, 50);
}

// Сравнение товаров
function comparePage() {
  // Сравнение товаров. Инвертирование свойств для сравнения товара
  $(".CompareCheckbox.invert").click(function () {
    var checked = true,
      checkboxes = $(".CompareCheckbox:not(.invert)");
    checkboxes.each(function () {
      if ($(this).attr("checked")) {
        checked = false;
        return false;
      }
    });
    checkboxes.each(function () {
      $(this).attr("checked", checked);
    });
    $(this).attr("checked", checked);
  });

  // Сравнение товаров. Скрытие характеристик товара, которые выделил пользователь
  $(".CompareGoodsHideSelected").click(function () {
    $(".CompareGoodsTableTbodyComparisonLine").each(function () {
      var CheckedCheckbox = $(this).find(".CompareCheckbox:checked:not(.invert)");
      if (CheckedCheckbox.length > 0) {
        $(this).hide();
      }
    });
    // отменяем выделение характеристик товаров
    $(".CompareCheckbox").attr("checked", false);
    return false;
  });

  // Сравнение товаров. Скрытие характеристик товара, которые выделил пользователь
  $(".CompareGoodsHideSelected").click(function () {
    $(".CompareGoodsShowAll").show();
    $(".CompareGoodsTableTbodyComparisonLine").each(function () {
      var CheckedCheckbox = $(this).find(".CompareCheckbox:checked:not(.invert)");
      if (CheckedCheckbox.length > 0) {
        $(this).hide();
      }
    });
    // отменяем выделение характеристик товаров
    $(".CompareCheckbox").attr("checked", false);
    return false;
  });

  // Сравнение товаров. Отображение скрытых характеристик товара
  $(".CompareGoodsShowAll").click(function () {
    $(this).hide();
    $(".CompareGoodsTableTbodyComparisonLine:hidden").show();
    return false;
  });

  // Сравнение товаров. Верхняя навигация изменение фильтра на отображение всех характеристик товаров
  $(".CompareGoodsTableFilterShowAll").click(function () {
    $(".CompareGoodsTableFilterSelected").removeClass("CompareGoodsTableFilterSelected");
    $(".CompareGoodsTableTbodyComparisonLine:hidden").show();
    $(this).addClass("CompareGoodsTableFilterSelected");
    return false;
  });

  // Сравнение товаров. Фильтр в верхней навигации. Отображение только различающихся характеристик товара
  $(".CompareGoodsTableFilterShowOnlyDifferent").click(function () {
    $(".CompareGoodsTableFilterSelected").removeClass("CompareGoodsTableFilterSelected");
    $(".CompareGoodsTableTbodyComparisonLine:not(.same)").show();
    $(".CompareGoodsTableTbodyComparisonLine.same").hide();
    $(this).addClass("CompareGoodsTableFilterSelected");
    return false;
  });

  // При клике по строке выделяем свойство
  $(".CompareGoodsTableTbodyComparisonLine td:not(.cell)").click(function () {
    var CompareCheckbox = $(this).parent().find(".CompareCheckbox");
    if (CompareCheckbox.attr("checked")) {
      CompareCheckbox.attr("checked", false);
    } else {
      CompareCheckbox.attr("checked", true);
    }
  });

  function compareGetVars() {
    return new Array(
      $(".CompareGoodsTableTbody tr:first td").length - 1,
      parseInt(
        $(".CompareGoodsTableTbody tr:first td:visible:not(.cell)")
          .attr("class")
          .replace(new RegExp("compare-td compare-td-"), "")
      ),
      parseInt(
        $(".CompareGoodsTableTbody tr:first td:visible:last")
          .attr("class")
          .replace(new RegExp("compare-td compare-td-"), "")
      )
    );
  }

  // Прокрутка списка сравнения вправо
  $(".CompareGoodsTableNext").click(function () {
    // Определяем используемые поля
    var data = compareGetVars();
    // Изменяем их если это возможно.
    if (data[0] > data[2]) {
      $(".compare-td-" + data[1]).hide();
      $(".compare-td-" + (data[2] + 1)).show();
      if (data[2] + 1 >= data[0]) {
        $(this).find("a").addClass("disable");
      }
      if (data[1] + 1 != 1) {
        $(".CompareGoodsTablePrev a").removeClass("disable");
      }
    }
    return false;
  });

  // Прокрутка списка сравнения влево
  $(".CompareGoodsTablePrev").click(function () {
    // Определяем используемые поля
    var data = compareGetVars();
    // Изменяем их если это возможно.
    if (1 < data[1]) {
      $(".compare-td-" + (data[1] - 1)).show();
      $(".compare-td-" + data[2]).hide();
      if (data[1] - 1 <= 1) {
        $(this).find("a").addClass("disable");
      }
      if (data[2] - 1 != data[0]) {
        $(".CompareGoodsTableNext a").removeClass("disable");
      }
    }
    return false;
  });
}

// Показать пароль
$(function () {
  $(".showPass").click(function () {
    ChangePasswordFieldType(this, $("#sites_client_pass"));
    return false;
  });
});

// Основные функции
function MainFunctions() {
  $(function () {
    // Валидация формы на странице оформления заказа, а так же формы на страницы связи с администрацией
    $(
      "#myform, .feedbackForm, .clientForm, #quickform, .goodsDataOpinionAddForm, .callback-info .callbackForm"
    ).validate({
      rules: {
        reg_name: "required",
      },
    });

    // Отправка формы по Ctrl+Enter
    $("form")
      .bind("keypress", function (e) {
        if (e.ctrlKey && (e.which == 10 || e.which == 13)) {
          $(this).submit();
        }
        // Отправка данных формы по нажатию на Enter в случае если курсор находится в input полях (В некоторых браузерах при нажатии по enter срабатывает клик по первому submit полю, которое является кнопкой назад. Для этого написан этот фикс)
      })
      .find("input")
      .bind("keypress", function (e) {
        if (e.which == 10 || e.which == 13) {
          try {
            $(this.form).submit();
          } catch (e) {}
          return false;
        }
      });

    // Функция собирает свойства в строку, для определения модификации товара
    function getSlugFromGoodsDataFormModificationsProperties(obj) {
      var properties = new Array();
      $(obj).each(function (i) {
        properties[i] = parseInt($(this).val());
      });
      return properties
        .sort(function (a, b) {
          return a - b;
        })
        .join("_");
    }

    var // Запоминаем поля выбора свойств, для ускорения работы со значениями свойств
      goodsDataProperties = $('form.goodsDataForm select[name="form[properties][]"]'),
      // Запоминаем блоки с информацией по модификациям, для ускорения работы
      goodsDataModifications = $("div.goodsDataMainModificationsList");

    // Обновляет возможность выбора свойств модификации, для отключения возможности выбора по характеристикам модификации которой не существует.
    function updateVisibility(y) {
      // Проверяем в каждом соседнем поле выбора модификаций, возможно ли подобрать модификацию для указанных свойств
      goodsDataProperties.each(function (j) {
        // Если мы сравниваем значения свойства не с самим собой, а с другим списком значений свойств
        if (j != y) {
          // Проходим по всем значениям текущего свойства модификации товара
          $(this)
            .find("option")
            .each(function () {
              // Записываем временный массив свойств, которые будем использовать для проверки существования модификации
              var checkProperties = new Array();
              $(goodsDataProperties).each(function (i) {
                checkProperties[i] = parseInt($(this).val());
              });
              // Пытаемся найти модификацию соответствующую выбранным значениям свойств
              checkProperties[j] = parseInt($(this).attr("value"));
              // Собираем хэш определяющий модификацию по свойствам
              slug = checkProperties
                .sort(function (a, b) {
                  return a - b;
                })
                .join("_");
              // Ищем модификацию по всем выбранным значениям свойств товара. Если модификации нет в возможном выборе, отмечаем потенциальное значение выбора как не доступное для выбора, т.к. такой модификации нет.
              if (!goodsDataModifications.filter('[rel="' + slug + '"]').length) {
                $(this).attr("disabled", true);
                // Если выбрав данное значение свойства товара можно подобрать модификацию, то выделяем вариант выбора как доступный.
              } else {
                $(this).attr("disabled", false);
              }
            });
        }
      });
    }
    // Обновляем возможность выбора модификации товара по свойствам. Для тех свойств, выбор по которым не возможен, отключаем такую возможность.
    // Проверяем возможность выбора на всех полях кроме первого, чтобы отключить во всех остальных варианты, которые не возможно выбрать
    updateVisibility(0);
    // Проверяем возможность выбора на всех полях кроме второго, чтобы в первом поле так же отключилась возможность выбора не существующих модификаций
    updateVisibility(1);

    // Меняет главное изображение товара на изображение с идентификатором goods_mod_image_id
    function changePrimaryGoodsImage(goods_mod_image_id) {
      // Если не указан идентификатор модификации товара, значит ничего менять не нужно.
      if (1 > goods_mod_image_id) {
        return true;
      }
      var // Блок с изображением выбранной модификации товара
        goodsModImageBlock = $(
          'div.owl-carousel a[data-image-id="' + parseInt(goods_mod_image_id) + '"]'
        ),
        // Блок, в котором находится главное изображение товара
        MainImageBlock = $("#zoom1"),
        // Изображение модификации товара, на которое нужно будет изменить главное изображение товара.
        MediumImageUrl = goodsModImageBlock.attr("href"),
        // Главное изображение, в которое будем вставлять новое изображение
        MainImage = MainImageBlock.find("img.goods-image-medium"),
        // В этом объекте хранится идентификатор картинки главного изображения для коректной работы галереи изображений
        MainImageInfo = $("div.goodsImageZoom:eq(0)");
      // Если не удалось найти блок, в котором находится главное изображение товара
      if (!MainImageBlock.length) {
        console.log("GoodsModImage error: MainImageBlock not found");
        return false;
      }
      // Если не удалось найти главное изображение товара
      if (!MainImage.length) {
        console.log("GoodsModImage error: MainImage not found");
        return false;
      }
      // Если не удалось найти главное изображение товара
      if (!goodsModImageBlock.length) {
        console.log("GoodsModImage error: goodsModImageBlock not found");
        return false;
      }
      // Если не удалось найти URL изображения для модификации товара
      if (typeof MediumImageUrl === "undefined") {
        console.log("GoodsModImage error: MediumImageUrl not found");
        return false;
      }
      // Если изображение модификации товара найдено - изменяем главное изображение
      MainImage.attr("src", MediumImageUrl);
      MainImageInfo.attr("data", parseInt(goods_mod_image_id));

      return true;
    }

    // Изменение цены товара при изменении у товара свойства для модификации
    goodsDataProperties.each(function () {
      $(this).change(function () {
        var slug = getSlugFromGoodsDataFormModificationsProperties(goodsDataProperties),
          modificationBlock = $('.goodsDataMainModificationsList[rel="' + slug + '"]'),
          modificationGoodsModImageId = modificationBlock.find('[name="goods_mod_image_id"]').val(),
          modificationId = parseInt(modificationBlock.find('[name="id"]').val()),
          modificationArtNumber = modificationBlock.find('[name="art_number"]').val(),
          modificationPriceNow = parseInt(modificationBlock.find('[name="price_now"]').val()),
          modificationPriceNowFormated = modificationBlock.find(".price_now_formated").html(),
          modificationPriceOld = parseInt(modificationBlock.find('[name="price_old"]').val()),
          modificationPriceOldFormated = modificationBlock.find(".price_old_formated").html(),
          modificationRestValue = parseFloat(modificationBlock.find('[name="rest_value"]').val()),
          modificationDescription = modificationBlock.find(".description").html(),
          modificationMeasureId = parseInt(modificationBlock.find('[name="measure_id"]').val()),
          modificationMeasureName = modificationBlock.find('[name="measure_name"]').val(),
          modificationMeasureDesc = modificationBlock.find('[name="measure_desc"]').val(),
          modificationMeasurePrecision = modificationBlock.find('[name="measure_precision"]').val(),
          modificationIsHasInCompareList = modificationBlock
            .find('[name="is_has_in_compare_list"]')
            .val(),
          goodsModificationId = $(".goodsDataMainModificationId"),
          goodsPriceNow = $(".goodsDataMainModificationPriceNow"),
          goodsPriceOld = $(".goodsDataMainModificationPriceOld"),
          goodsAvailable = $(".goodsDataMainModificationAvailable"),
          goodsAvailableTrue = goodsAvailable.find(".available-true"),
          goodsAvailableFalse = goodsAvailable.find(".available-false"),
          goodsAvailableAddCart = $(".add-to-form .add-to-cart"),
          goodsAvailableQty = $(".add-to-form .wrap-qty"),
          goodsArtNumberBlock = $(".goodsDataMainModificationArtNumber"),
          goodsArtNumber = goodsArtNumberBlock.find("span"),
          goodsCompareAddButton = $(".goodsDataCompareButton.add"),
          goodsCompareDeleteButton = $(".goodsDataCompareButton.delete"),
          goodsModDescriptionBlock = $(".goodsDataMainModificationsDescriptionBlock"),
          goodsModEmpty = $(".goodsDataMainModificationEmpty");

        // Изменяем данные товара для выбранных параметров. Если нашлась выбранная модификация
        if (modificationBlock.length) {
          // Обновляем изображение модификации товара, если оно указано
          changePrimaryGoodsImage(modificationGoodsModImageId);
          // Цена товара
          goodsPriceNow.html(modificationPriceNowFormated);
          // Старая цена товара
          if (modificationPriceOld > modificationPriceNow) {
            goodsPriceOld.html(modificationPriceOldFormated);
          } else {
            goodsPriceOld.html("");
          }
          // Есть ли товар есть в наличии
          if (modificationRestValue > 0) {
            goodsAvailableTrue.show();
            goodsAvailableFalse.hide();
            goodsAvailableAddCart.show();
            goodsAvailableQty.show();
            goodsModEmpty.hide();
            // Если товара нет в наличии
          } else {
            goodsAvailableTrue.hide();
            goodsAvailableFalse.show();
            goodsAvailableAddCart.hide();
            goodsAvailableQty.hide();
            goodsModEmpty.show();
          }
          // Если товар есть в списке сравнения
          if (modificationIsHasInCompareList > 0) {
            goodsCompareAddButton.hide();
            goodsCompareDeleteButton.show();
            // Если товара нет в списке сравнения
          } else {
            goodsCompareAddButton.show();
            goodsCompareDeleteButton.hide();
          }
          // Покажем артикул модификации товара, если он указан
          if (modificationArtNumber.length > 0) {
            goodsArtNumberBlock.show();
            goodsArtNumber.html(modificationArtNumber);
            // Скроем артикул модификации товара, если он не указан
          } else {
            goodsArtNumberBlock.hide();
            goodsArtNumber.html("");
          }
          // Описание модификации товара. Покажем если оно есть, спрячем если его у модификации нет
          if (modificationDescription.length > 0) {
            goodsModDescriptionBlock.show().html("<div>" + modificationDescription + "</div>");
          } else {
            goodsModDescriptionBlock.hide().html();
          }
          // Идентификатор товарной модификации
          goodsModificationId.val(modificationId);
        } else {
          // Отправим запись об ошибке на сервер
          sendError("no modification by slug " + slug);
          alert(
            "К сожалению сейчас не получается подобрать модификацию соответствующую выбранным параметрам."
          );
        }
      });
    });
  });
}

// Боковое меню сохранение открытой вложенности
function accordion() {
  $('.block.catalog .parent:not(".active") a').next(".sub").css("display", "none");
  $(".block.catalog .parent a .open-sub").click(function (event) {
    event.preventDefault();
    if ($(this).closest(".parent").hasClass("active")) {
      $(this).parent().next(".sub").slideUp(600);
      $(this).closest(".parent").removeClass("active");
      $(this).closest(".open-sub").removeClass("active");
    } else {
      $(this).parent().next(".sub").slideDown(600);
      $(this).closest(".parent").addClass("active");
      $(this).closest(".open-sub").addClass("active");
    }
  });
}
// Запуск блока Вы смотрели
function viewed() {
  $(".viewed .owl-carousel").owlCarousel({
    items: 1,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navText: [,],
    dots: false,
    autoplay: true,
    autoplayHoverPause: true,
  });
}
// Функции для каталога
function catalogFunctions() {
  // Слайдер в каталоге
  $("#slideshow-catalog .owl-carousel").owlCarousel({
    items: 1,
    loop: true,
    rewind: true,
    lazyLoad: false,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayHoverPause: true,
    smartSpeed: 500,
    dotsSpeed: 400,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
  });

  // Фильтр по ценам
  var // Минимальное значение цены для фильтра
    priceFilterMinAvailable = parseInt($(".goodsFilterPriceRangePointers .min").text()),
    // Максимальное значение цены для фильтра
    priceFilterMaxAvailable = parseInt($(".goodsFilterPriceRangePointers .max").text()),
    // Максимальное значение цены для фильтра
    priceSliderBlock = $("#goods-filter-price-slider")[0],
    // Поле ввода текущего значения цены "От"
    priceInputMin = $("#goods-filter-min-price"),
    // Поле ввода текущего значения цены "До"
    priceInputMax = $("#goods-filter-max-price"),
    // Блок с кнопкой, которую есть смысл нажимать только тогда, когда изменялся диапазон цен.
    priceSubmitButtonBlock = $(".goodsFilterPriceSubmit");

  // Изменяет размер ячеек с ценой, т.к. у них нет рамок, есть смысл менять размеры полей ввода, чтобы они выглядили как текст
  function priceInputsChangeWidthByChars() {
    // Если есть блок указания минимальной цены
    if (priceInputMin.length) {
      priceInputMin.css("width", priceInputMin.val().length * 7 + 60 + "px");
      priceInputMax.css("width", priceInputMax.val().length * 7 + 60 + "px");
    }
  }
  // Обновить размеры полей ввода диапазона цен
  priceInputsChangeWidthByChars();

  // Слайдер, который используется для удобства выбора цены
  if (priceSliderBlock) {
    noUiSlider.create(priceSliderBlock, {
      start: [
        parseInt($("#goods-filter-min-price").val()),
        parseInt($("#goods-filter-max-price").val()),
      ],
      connect: true,
      range: {
        min: priceFilterMinAvailable,
        max: priceFilterMaxAvailable,
      },
    });

    priceSliderBlock.noUiSlider.on("slide", function (values, handle) {
      var newVal = parseInt(values[handle]);

      /*
       * 0 - left handle
       * 1 - right handle
       */
      if (handle) {
        priceInputMax.val(newVal);
      } else {
        priceInputMin.val(newVal);
      }

      priceInputsChangeWidthByChars();
    });

    // При изменении минимального значения цены
    priceInputMin.keyup(function () {
      var newVal = parseInt($(this).val());
      if (newVal < priceFilterMinAvailable) {
        newVal = priceFilterMinAvailable;
      }
      priceSliderBlock.noUiSlider.set([newVal, null]);
      priceInputsChangeWidthByChars();
    });

    // При изменении максимального значения цены
    priceInputMax.keyup(function () {
      var newVal = parseInt($(this).val());
      if (newVal > priceFilterMaxAvailable) {
        newVal = priceFilterMaxAvailable;
      }
      priceSliderBlock.noUiSlider.set([null, newVal]);
      priceInputsChangeWidthByChars();
    });
  }

  // Фильтры по товарам. При нажании на какую либо характеристику или свойство товара происходит фильтрация товаров
  $(".filters-goods input").click(function () {
    $(this)[0].form.submit();

    return;
  });

  $(".filters-goods-active input").click(function () {
    $(this)[0].form.submit();
  });

  // Показать/скрыть категорию фильтра
  $(".block.filters").on("click", ".title", function () {
    var $title = $(this);

    if ($(this).hasClass("_main")) {
      return;
    }

    $title.toggleClass("active").next(".layout-slider, .filter-inner").slideToggle();
  });

  $(".block.filters, .block.viewed").on("click", ".title", function () {
    if (getClientWidth() <= 991) {
      var $title = $(this);

      $title.next(".content").addClass("_active");
      $(".overlay").addClass("_active");
    }
  });

  $(".overlay, .content-close-btn")
    .off("click")
    .on("click", function () {
      $(".overlay").removeClass("_active");
      $(".filters .content, .viewed  .content").removeClass("_active");
    });

  // Показать все/скрыть
  $(".block.filters").on("click", ".filter-more", function () {
    var $btn = $(this);
    var offsetTop = $btn.siblings(".title").offset().top;

    $btn.prev(".filter-inner").toggleClass("crop");

    if ($btn.hasClass("active")) {
      $btn.removeClass("active").find(".filter-moreText").text("Показать все");

      if (getClientWidth() > 992) {
        $("html, body").animate({ scrollTop: offsetTop });
      }
    } else {
      $btn.addClass("active").find(".filter-moreText").text("Скрыть");
    }
  });

  // ajax вывод товаров списком/таблицей без обновления страницы
  $(".OrderFilterForm").on("click", ".view-mode > a", function () {
    var href = document.location.href;
    var dataHref = $(this).data("href").slice(1);
    var browser = null;
    var qwe = navigator.userAgent;
    var separator = href.indexOf("?") + 1 ? "&" : "?";

    if (qwe.search(/MSIE/) != -1) {
      browser = "IE";
    }
    if (href.indexOf("#page-title") != -1) {
      href = href.replace("#page-title", "");
    }

    var url =
      browser === "IE" ? encodeURI(href + separator + dataHref) : href + separator + dataHref;

    $(".products-ajax").addClass("fadeout");
    $(".products-container").prepend('<span class="content-loading"></span>');
    $.ajax({
      url: url,
      cache: false,
      success: function (d) {
        $(".products-ajax").parent().html($(d).find(".products-ajax").parent().html());
        lozad().observe();
        $(".view-mode").html($(d).find(".view-mode").html());
        Addto();
        AddCart();
        quickView();
        quantity();
      },
    });
  });
}
// Выносим функции из шаблонов
function outFunctions() {
  $(function () {
    // Вызов функции быстрого заказа в корзине
    $("#startOrder, #startOrderTab").on("click", function () {
      startOrder();
      return false;
    });
    // Вызов функции редиректа при обратном звонке
    $("#footer .callbackForm").submit(validCallBack);
    $("#fancybox-callback .callbackForm").submit(validCallBackC);
    $("#fancybox-feedback .feedbackForm-header").submit(validCallBackF);
    // Возврашаем пользователя на страницу с которой был сделан обратный звонок
    $(".callbackredirect").val(document.location.href);

    // Добавление товара в корзину
    $(".wrapper").on("click", ".add-cart", function () {
      var form = $(this).closest("form");
      if ($(this).hasClass("quick")) {
        form.attr("rel", "quick");
      } else {
        var rel = form.attr("rel");
        if (rel) {
          form.attr("rel", rel.replace("quick", ""));
        }
      }
      form.trigger("submit");
      return false;
    });
    // Слайдер в подвале
    $("#footer .block.collapse .title").on("click", function () {
      if (getClientWidth() <= 991) {
        $(this).toggleClass("active").next(".block-content").slideToggle();
      }
    });
  });
}

// Добавление товара в корзину
function AddCart() {
  $(".goodsDataForm, .goodsToCartFromCompareForm, .goodsListForm")
    .off("submit")
    .submit(function () {
      // Выносим функции из шаблонов
      if ($(this).attr("rel") === "quick") {
        quickOrder(this);
        return false;
      }

      $("#header .cart").addClass("have-items");
      $(".cart .count").animate({ opacity: 0, display: "none" }, 500);
      $(".cart .count").animate({ display: "inline", opacity: 1 }, 500);

      // Находим форму, которую отправляем на сервер, для добавления товара в корзину
      var formBlock = $($(this).get(0));

      // Проверка на существование формы отправки запроса на добавление товара в корзину
      if (1 > formBlock.length || formBlock.get(0).tagName != "FORM") {
        alert("Не удалось найти форму добавления товара в корзину");
        return false;
      }

      // Получаем данные формы, которые будем отправлять на сервер
      var formData = formBlock.serializeArray();
      // Сообщаем серверу, что мы пришли через ajax запрос
      formData.push({ name: "ajax_q", value: 1 });
      // Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа
      //formData.push({name: 'fast_order', value: 1});
      // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
      $.ajax({
        type: "POST",
        cache: false,
        url: formBlock.attr("action"),
        data: formData,
        success: function (data) {
          $.fancybox({
            content: data,
          });
        },
      });
      return false;
    });
}
// Добавление в сравнение и избранное
function Addto() {
  // Добавление/удаление товара на сравнение/избранное через ajax
  $(".add-compare").click(function () {
    // Объект ссылки, по которой кликнули
    var a = $(this),
      addUrl = a.attr("data-action-add-url"),
      delUrl = a.attr("data-action-delete-url"),
      addTitle = a.attr("data-action-add-title"),
      delTitle = a.attr("data-action-delete-title"),
      isAdd = a.attr("data-action-is-add"),
      pName = a.attr("data-prodname"),
      pImage = a.attr("data-prodimage"),
      pPrice = a.attr("data-mod-id-price"),
      pUrl = a.attr("data-produrl"),
      pDataid = a.attr("data-id"),
      pDataprice = a.attr("data-mod-id"),
      pDataGoodsid = a.attr("data-goodsid"),
      aText = a.parent().find(".add-compare"),
      addTooltip = a.attr("data-add-tooltip"),
      delTooltip = a.attr("data-del-tooltip");
    requestUrl = a.attr("href");
    var flag = 0;
    $("#compare-items li.item").each(function () {
      if ($(this).attr("data-id") == pDataid) {
        flag = 1;
      }
      if (flag == 1) {
        $(this).remove();
        return false;
      }
      return flag;
    });
    $(".compare #compare-items .empty").hide();
    $(".compare #compare-items .actions").show();

    // Если в ссылке присутствует идентификатор, который мы можем узнать только вытащив его с текущей страницы
    if (/GET_GOODS_MOD_ID_FROM_PAGE/.test(requestUrl)) {
      requestUrl = requestUrl.replace(
        new RegExp("GET_GOODS_MOD_ID_FROM_PAGE"),
        $(".goodsDataMainModificationId").val()
      );
    }

    // Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
    if (addUrl && delUrl) {
      $.ajax({
        type: "POST",
        dataType: "json",
        cache: false,
        url: requestUrl,
        data: {
          ajax_q: 1,
        },
        success: function (data) {
          if (flag == 0) {
            $("#compare-items .compare-items-list").prepend(
              '<li class="item" data-id="' +
                pDataid +
                '">' +
                '<a data-href="' +
                delUrl +
                "?id=" +
                pDataprice +
                '" data-goods-mod-id="' +
                pDataprice +
                '" class="remove item-remove" title="Убрать товар из списка сравнения" onclick="removeFromCompare($(this))"></a>' +
                '<a href="' +
                pUrl +
                '" title="' +
                pName +
                '" class="product-image">' +
                '<img src="' +
                pImage +
                '" alt="' +
                pName +
                '" class="goods-image-icon">' +
                "</a>" +
                '<div class="product-details">' +
                '<p class="product-name">' +
                '<a href="' +
                pUrl +
                '" title="' +
                pName +
                '">' +
                pName +
                "</a>" +
                "</p>" +
                '<span class="price RUB" data-price="' +
                pPrice +
                '"><span><span class="num">' +
                addSpaces(String(pPrice)) +
                "&nbsp;</span></span></span>" +
                "</div>" +
                "</li>"
            );
          }
          if ("ok" == data.status) {
            if (isAdd == 1) {
              var from = addUrl,
                to = delUrl,
                newIsAddStatus = 0,
                newTitle = delTitle ? delTitle : "",
                newTooltip = delTooltip ? delTooltip : "";
              a.addClass("added");
            } else {
              var from = delUrl,
                to = addUrl,
                newIsAddStatus = 1,
                newTitle = addTitle ? addTitle : "",
                newTooltip = addTooltip ? addTooltip : "";
              a.removeClass("added");
            }

            // Если указано, что изменилось число товаров на сравнении
            if (typeof data.compare_goods_count != "undefined") {
              // Блок информации о том, что есть товары на сравнении
              var sidecount = $(".compare .count");
              // Если на сравнении больше нет товаров
              // Указываем информацию о новом количестве товаров на сравнении
              // Блок обновления списка сравнения в каталога
              sidecount
                .animate({ opacity: 0, display: "none" }, 500, function () {
                  sidecount.text(data.compare_goods_count);
                  if (data.compare_goods_count > 0) {
                    $(".compare").addClass("have-items");
                    $(".compare #compare-items .empty").hide();
                    $(".compare #compare-items .actions").show();
                  } else {
                    $(".compare").removeClass("have-items");
                    $(".compare #compare-items .empty").show();
                    $(".compare #compare-items .actions").hide();
                  }
                })
                .animate({ display: "inline", opacity: 1 }, 500);
            }

            // Обновляем ссылку, на которую будет уходить запрос и информацию о ней
            a.attr("href", a.attr("href").replace(new RegExp(from), to))
              .attr("title", newTitle)
              .attr("data-tooltip", newTooltip)
              .attr("data-action-is-add", newIsAddStatus);
          }

          var msgType = "ok" == data.status ? "success" : "error";
          var message =
            "ok" == data.status
              ? data.message.replace(
                  "сравнения",
                  '<a href="/compare" class="underline">сравнения</a>'
                )
              : data.message;
          // Если есть функция, которая отображает сообщения пользователю
          if (typeof Noty == "function") {
            new Noty({
              text: message,
              type: msgType,
              layout: "bottomRight",
              timeout: "2000",
              animation: {
                open: "animated bounceInRight",
                close: "animated bounceOutRight",
              },
            }).show();
          }
        },
      });
      return false;
    }
  });

  // Добавление/удаление товара на сравнение/избранное через ajax
  $(".add-wishlist").click(function () {
    // Объект ссылки, по которой кликнули
    var a = $(this),
      addUrl = a.attr("data-action-add-url"),
      delUrl = a.attr("data-action-delete-url"),
      addTitle = a.attr("data-action-add-title"),
      delTitle = a.attr("data-action-delete-title"),
      isAdd = a.attr("data-action-is-add"),
      aText = a.parent().find(".add-wishlist"),
      pName = a.attr("data-prodname"),
      pImage = a.attr("data-prodimage"),
      pUrl = a.attr("data-produrl"),
      pDataid = a.attr("data-id"),
      pDataprice = a.attr("data-mod-id"),
      pPrice = a.attr("data-mod-id-price"),
      pDataGoodsid = a.attr("data-goodsid"),
      addTooltip = a.attr("data-add-tooltip"),
      delTooltip = a.attr("data-del-tooltip");
    requestUrl = a.attr("href");
    var flag = 0;
    $("#favorites-items li").each(function () {
      if ($(this).attr("data-id") == pDataid) {
        flag = 1;
      }
      if (flag == 1) {
        $(this).remove();
        return false;
      }
      return flag;
    });

    // Если в ссылке присутствует идентификатор, который мы можем узнать только вытащив его с текущей страницы
    if (/GET_GOODS_MOD_ID_FROM_PAGE/.test(requestUrl)) {
      requestUrl = requestUrl.replace(
        new RegExp("GET_GOODS_MOD_ID_FROM_PAGE"),
        $(".goodsDataMainModificationId").val()
      );
    }

    // Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
    if (addUrl && delUrl) {
      $.ajax({
        type: "POST",
        dataType: "json",
        cache: false,
        url: requestUrl,
        data: {
          ajax_q: 1,
        },
        success: function (data) {
          if (data.status != "error") {
            $(".favorites #favorites-items .empty").hide();
            $(".favorites #compare-items .actions").show();
          }

          if (flag == 0 && data.status != "error") {
            $("#favorites-items .favorites-items-list").prepend(
              '<li class="item" data-id="' +
                pDataid +
                '">' +
                '<a data-href="' +
                delUrl +
                "?id=" +
                pDataprice +
                '" data-goods-mod-id="' +
                pDataprice +
                '" class="remove item-remove" title="Убрать товар из списка сравнения" onclick="removeFromFavorites($(this))"></a>' +
                '<a href="' +
                pUrl +
                '" title="' +
                pName +
                '" class="product-image">' +
                '<img src="' +
                pImage +
                '" alt="' +
                pName +
                '" class="goods-image-icon">' +
                "</a>" +
                '<div class="product-details">' +
                '<p class="product-name">' +
                '<a href="' +
                pUrl +
                '" title="' +
                pName +
                '">' +
                pName +
                "</a>" +
                "</p>" +
                '<span class="price RUB" data-price="' +
                pPrice +
                '"><span><span class="num">' +
                addSpaces(String(pPrice)) +
                "&nbsp;</span></span></span>" +
                "</div>" +
                "</li>"
            );
          }
          if ("ok" == data.status) {
            if (isAdd == 1) {
              var from = addUrl,
                to = delUrl,
                newIsAddStatus = 0,
                newTitle = delTitle ? delTitle : "",
                newTooltip = delTooltip ? delTooltip : "";
              a.addClass("added");
            } else {
              var from = delUrl,
                to = addUrl,
                newIsAddStatus = 1,
                newTitle = addTitle ? addTitle : "",
                newTooltip = addTooltip ? addTooltip : "";
              a.removeClass("added");
            }

            // Если указано, что изменилось число товаров на сравнении
            if (typeof data.favorites_goods_count != "undefined") {
              // Блок информации о том, что есть товары на сравнении
              var sidecount = $(".favorites .count");
              // Если на сравнении больше нет товаров
              // Указываем информацию о новом количестве товаров на сравнении
              // Блок обновления списка сравнения в каталога
              sidecount
                .animate({ opacity: 0, display: "none" }, 500, function () {
                  sidecount.text(data.favorites_goods_count);
                  if (data.favorites_goods_count > 0) {
                    $(".favorites").addClass("have-items");
                    $(".favorites #favorites-items .empty").hide();
                    $(".favorites #favorites-items .actions").show();
                  } else {
                    $(".favorites").removeClass("have-items");
                    $(".favorites #favorites-items .empty").show();
                    $(".favorites #favorites-items .actions").hide();
                  }
                })
                .animate({ display: "inline", opacity: 1 }, 500);
            }

            // Обновляем ссылку, на которую будет уходить запрос и информацию о ней
            a.attr("href", a.attr("href").replace(new RegExp(from), to))
              .attr("title", newTitle)
              .attr("data-tooltip", newTooltip)
              .attr("data-action-is-add", newIsAddStatus);
          }

          var msgType = "ok" == data.status ? "success" : "error";
          var message =
            "ok" == data.status
              ? data.message.replace(
                  "избранное",
                  '<a href="/user/favorites" class="underline">избранное</a>'
                )
              : data.message;
          // Если есть функция, которая отображает сообщения пользователю
          if (typeof Noty == "function") {
            new Noty({
              text: message,
              type: msgType,
              layout: "bottomRight",
              timeout: "2000",
              animation: {
                open: "animated bounceInRight",
                close: "animated bounceOutRight",
              },
            }).show();
          }
        },
      });
      return false;
    }
  });
}

// Регистрация и выбор доставки
function OrderScripts() {
  $(function () {
    // Форма регистрации нового пользователя, при оформлении заказа
    $(".OrderShowPass").click(function () {
      ChangePasswordFieldType(this, $("#contactPassWord"));
      return false;
    });
    // При оформлении заказа дадим возможность зарегистрироваться пользователю
    $("#contactWantRegister").click(function () {
      if ($(this).prop("checked")) {
        $(".contactRegisterNeedElement").show();
        $("#contactEmail, #contactPassWord").addClass("required");
      } else {
        $(".contactRegisterNeedElement").hide();
        $("#contactEmail, #contactPassWord").removeClass("required");
      }
    });

    $(function () {
      $(".deliveryRadio").each(function () {
        var id = $(this).val(),
          fz = $($(".deliveryZoneRadio[deliveryid=" + id + "]")[0]);
        price = fz.next().find(".num").text();
        oldPrice = $("tbody[rel=" + id + "]")
          .find(".pricefield")
          .find(".num");
        if (price != "") {
          oldPrice.text(price);
        }
      });
    });
    $(function () {
      $(".orderStageDeliveryListTable").on("change", ".deliveryRadio", function () {
        $(".deliveryRadio, .deliveryZoneRadio").each(function () {
          $(this).removeAttr("checked");
        });
        var id = $(this).val(),
          fz = $($(".deliveryZoneRadio[deliveryid=" + id + "]")[0]);
        $(this).prop("checked", true);
        fz.prop("checked", true);
        price = fz.next().find(".num").text();
        oldPrice = $("tbody[rel=" + id + "]")
          .find(".pricefield")
          .find(".num");
        if (price != "") {
          oldPrice.text(price);
        }
      });
    });
    // Действия при выборе зоны внутри варианта доставки на этапе оформления заказа
    $(".deliveryZoneRadio").click(function () {
      var id = $(this).attr("deliveryid"),
        price = $(this).next().find(".num").text(),
        oldPrice = $("tbody[rel=" + id + "]")
          .find(".pricefield")
          .find(".num");
      if (price != "") {
        oldPrice.text(price);
      }
      $(".deliveryRadio").each(function () {
        $(this).removeAttr("checked");
        if ($(this).val() == id) {
          $(this).prop("checked", true);
        } else {
          $(this).removeAttr("checked");
        }
      });
    });

    // Выбор даты доставки
    // Документация к плагину //t1m0n.name/air-datepicker/docs/index-ru.html
    $("#deliveryConvenientDate").datepicker({
      // Если true, то при активации даты, календарь закроется.
      autoClose: true,
      // Можно выбрать только даты, идущие за сегодняшним днем, включая сегодня
      minDate: new Date(),
    });
  });
}

// Скрипты для Быстрого заказа
function quickOrderScripts() {
  $(function () {
    $(function () {
      var ID = $('input[name="form[delivery][id]"]:checked').val();

      $(".quick_order_payment").hide();
      $('.quick_order_payment[rel="' + ID + '"]').show();
      $('.quick_order_payment[rel="' + ID + '"]')
        .find("input:first")
        .attr("checked", true);
    });

    $(".deliveryRadio").click(function () {
      var ID = $('input[name="form[delivery][id]"]:checked').val();
      $(".quick_order_payment").hide();
      $('.quick_order_payment[rel="' + ID + '"]').show();
      $('.quick_order_payment[rel="' + ID + '"]')
        .find("input:first")
        .attr("checked", true);
    });

    // Действия при выборе варианта доставки на этапе оформления заказа
    $(function () {
      sd = $($(".deliveryRadio")[0]);
      (id = sd.val()), (fz = $($(".deliveryZoneRadio[deliveryid=" + id + "]")[0]));
      sd.prop("checked", true);
      fz.prop("checked", true);
      price = fz.next().find(".num").text();
      oldPrice = $("tbody[rel=" + id + "]")
        .find(".pricefield")
        .find(".num");
      oldPrice.text(price);
    });

    $(function () {
      selectPayment = $(".quick_order_payment").css("display");
      $(".quick_order_payment").change(function () {
        selectValue = $(this).find("option:checked").attr("value");
        $(".hiddenRadio .quick_order_payment").each(function () {
          if ($(this).css("display") == "block") {
            $(this)
              .find("input[value=" + selectValue + "]")
              .click();
          }
        });
      });

      $(".mainSelect > option").attr("selected", false);
      $(".mainSelect > option:first-of-type").attr("selected", true);

      loadPage = $(".mainSelect").find("option:selected").attr("delid");

      $(function () {
        $(".zoneSelect option").each(function () {
          id = $(this).attr("deliveryid");
          select = $(this).parent("select").length;
          $(".zoneSelect select").addClass("input");
        });
        currentDelivery = $(".mainSelect option:checked").attr("delid");
        $("div.zoneSelect select").each(function () {
          if ($(this).attr("del") != currentDelivery) {
            $(this).hide();
          }
        });
      });

      $(".mainSelect").change(function () {
        selectedDelId = $(this).find("option:selected").attr("delid");
        $(".zoneSelect select").hide();
        $('.zoneSelect select[del="' + selectedDelId + '"]').show();
        $(".zoneSelect select option").attr("selected", false);
        $('.zoneSelect select[del="' + selectedDelId + '"] option:first-of-type').attr(
          "selected",
          true
        );
        $('.deliveryOption .deliveryRadio[value="' + selectedDelId + '"]').click();

        WithoutZone = $("tbody[rel=" + selectedDelId + "] input.deliveryRadio:checked").attr(
          "pricewithoutzones"
        );
        WithZone = $("tbody[rel=" + selectedDelId + "] input.deliveryZoneRadio:checked").attr(
          "price"
        );

        if (WithZone >= 0) {
          startprice = WithZone;
        } else {
          startprice = WithoutZone;
        }

        currentPriceWithoutChange = parseInt($(".formfast-cart .total-sum").data("total-sum"));
        NewPriceWithChange = String(parseInt(startprice) + currentPriceWithoutChange);
        $(".formfast-cart .subtotal .delivery-sum .num").text(startprice);
        $(".formfast-cart .total-sum .num").text(addSpaces(NewPriceWithChange));

        $(".changeprice").text(startprice);
        $(".quick_order_payment").hide();
        $('.quick_order_payment[rel="' + selectedDelId + '"]').show();

        startInputId = $("input.deliveryRadio:checked").attr("value");
        $(".hiddenpayment input").attr("checked", false);
        $('.hiddenpayment[rel="' + startInputId + '"] input').each(function () {
          $(this).click();
          return false;
        });
        DeliveryDescription = $("input.deliveryRadio:checked").next("div").html();
        $(".currentDeliveryDescription").html(DeliveryDescription);
        PaymentDescription = $("input.paymentRadio:checked").next("div").html();
        $(".currentPaymentDescription").html(PaymentDescription);
        if (
          $("input.paymentRadio:checked").next("div").length &&
          $("input.paymentRadio:checked").next("div").html().trim() === ""
        ) {
          $(".currentPaymentDesc").css("display", "none");
        } else {
          $(".currentPaymentDesc").css("display", "block");
        }
      });
    });

    $(function () {
      WithoutZone = $("input.deliveryRadio:checked").attr("pricewithoutzones");
      WithZone = $(".deliveryZoneRadio:checked").attr("price");
      var startprice = 0;
      if (WithZone > 0) {
        startprice = WithZone;
      } else if (WithZone == 0 && WithoutZone == 0) {
        startprice = 0;
      } else {
        startprice = WithoutZone;
      }

      currentPriceWithoutChange = parseInt($(".formfast-cart .total-sum").data("total-sum"));
      NewPriceWithChange = String(parseInt(startprice) + currentPriceWithoutChange);
      $(".formfast-cart .subtotal .delivery-sum .num").text(startprice);
      $(".formfast-cart .total-sum .num").text(addSpaces(NewPriceWithChange));

      $(".orderStageDeliveryZonePrice .changeprice").text(startprice);
      $(".hiddenpayment input").attr("checked", false);
      startInputId = $("input.deliveryRadio:checked").attr("value");
      $('.hiddenpayment[rel="' + startInputId + '"] input').each(function () {
        $(this).click();
        return false;
      });
      DeliveryDescription = $("input.deliveryRadio:checked").next("div").html();
      $(".currentDeliveryDescription").html(DeliveryDescription);
      PaymentDescription = $("input.paymentRadio:checked").next("div").html();
      $(".currentPaymentDescription").html(PaymentDescription);
      if (
        $("input.paymentRadio:checked").next("div").length &&
        $("input.paymentRadio:checked").next("div").html().trim() === ""
      ) {
        $(".currentPaymentDesc").css("display", "none");
      } else {
        $(".currentPaymentDesc").css("display", "block");
      }
    });

    $(".paymentSelect").change(function () {
      selectedDelId = $(this).find("option:selected").attr("value");
      $('.orderStagePayment .paymentRadio[value="' + selectedDelId + '"]').click();
      PaymentDescription = $("input.paymentRadio:checked").next("div").html();
      $(".currentPaymentDescription").html(PaymentDescription);
      if (
        $("input.paymentRadio:checked").next("div").length &&
        $("input.paymentRadio:checked").next("div").html().trim() === ""
      ) {
        $(".currentPaymentDesc").css("display", "none");
      } else {
        $(".currentPaymentDesc").css("display", "block");
      }
    });

    // Валидация формы на странице оформления заказа
    $("#quickform")
      .submit(function () {
        // Если форма невалидна не отправляем её на сервер
        if (!$(this).valid()) {
          return false;
        }
        // Получаем данные формы, которые будем отправлять на сервер
        var formData = $(this).serializeArray();
        // Сообщаем серверу, что мы пришли через ajax запрос
        formData.push({ name: "ajax_q", value: 1 });
        // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
        $.ajax({
          type: "POST",
          dataType: "json",
          cache: false,
          url: $(this).attr("action"),
          data: formData,
          success: function (data) {
            // Если заказ был успешно создан
            if (data.status == "ok") {
              window.location = data.location;
            } else if (data.status == "error") {
              alert(data.message);
            } else {
              alert(
                "Во время оформления заказа возникла неизвестная ошибка. Пожалуйста, обратитесь в службу технической поддержки."
              );
            }
          },
        });
        return false;
      })
      .validate();
  });

  $(function () {
    $(".zoneSelect select").change(function () {
      optValue = $(this).find("option:selected").attr("value");
      $('.zones input[value="' + optValue + '"]').click();
      WithZone = $(".deliveryZoneRadio:checked").attr("price");
      $(".changeprice").text(WithZone);

      currentPriceWithoutChange = parseInt($(".formfast-cart .total-sum").data("total-sum"));
      NewPriceWithChange = String(parseInt(WithZone) + currentPriceWithoutChange);
      $(".formfast-cart .subtotal .delivery-sum .num").text(WithZone);
      $(".formfast-cart .total-sum .num").text(addSpaces(NewPriceWithChange));
    });
  });
}

// Быстрый заказ
function quickOrder(formSelector) {
  // Находим форму, которую отправляем на сервер, для добавления товара в корзину
  var formBlock = $($(formSelector).get(0));
  // Проверка на существование формы отправки запроса на добавление товара в корзину
  if (1 > formBlock.length || formBlock.get(0).tagName != "FORM") {
    alert("Не удалось найти форму добавления товара в корзину");
    return false;
  }
  // Получаем данные формы, которые будем отправлять на сервер
  var formData = formBlock.serializeArray();
  // Сообщаем серверу, что мы пришли через ajax запрос
  formData.push({ name: "ajax_q", value: 1 });
  // Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа
  formData.push({ name: "fast_order", value: 1 });
  // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
  $.ajax({
    type: "POST",
    cache: false,
    url: formBlock.attr("action"),
    data: formData,
    success: function (data) {
      $.fancybox({
        content: data,
        // При изменении размера окна изменяем размер окна оформления заказа
        onUpdate: function () {
          ppModal();
          return false;
        },
      });
      setTimeout(function () {
        $.fancybox.update();
      }, 500);
    },
  });
  return false;
}

// Получение центральной разметки страницы (для быстрого просмотра)
$(function () {
  $.fn.getColumnContent = function () {
    var block =
      $(this).length && $(this).hasClass("product-view")
        ? $(this).filter(".product-view")
        : $("div.product-view:eq(0)");

    // Размер заголовка
    block.find(".product-name").addClass("quick-view");
    block.find(".product-order").addClass("quick-view");
    // Удаляем блоки, которые не отображаются в быстром просмотре.
    block.find(".custom-block").remove();
    // Отключаем увеличение
    block.find(".general-img").find("a").attr("href", "javascript:void(0)");
    // Меняем ссылки со скролом
    var $scrollLinks = block.find(".scroll-link");
    $scrollLinks.each(function (i, link) {
      var tabId = $(link).attr("href").slice(-1);

      $(link).attr("href", $(link).data("href") + "#show_tab_" + tabId);
    });

    var productShopSize = block.find(".product-shop").children().length;

    if (!productShopSize) {
      // Удаляем пустой блок без характеристик и кр. описания
      block.find(".product-shop").remove();
      // Меняем разметку оставшихся блоков
      block
        .find(".product-img-box, .product-order")
        .removeClass("col-md-4 col-md-3 col-lg-3 ")
        .addClass("col-md-6");
    } else {
      block.find(".product-shop").removeClass("col-md-5 col-lg-5").addClass("col-md-4");
      block.find(".product-order").removeClass("col-md-3 col-lg-3").addClass("col-md-4");
    }

    return block;
  };
});
// Функция Быстрого просмотра товара
function quickView() {
  // Быстрый просмотр товара
  $(function () {
    // При наведении на блок товара загружаем контент этого товара, который будет использоваться для быстрого просмотра, чтобы загрузка происходила быстрее.
    $("div.products-container .item").mouseover(function () {
      // Если в блоке нет ссылки на быстрый просмотр, то не подгружаем никаких данных
      var link = $(this).find("a.quickview");
      if (link.length < 1) {
        return true;
      }
      // Если массив с подгруженными заранее карточками товара для быстрого просмотра ещё не создан - создадим его.
      if (typeof document.quickviewPreload == "undefined") {
        document.quickviewPreload = [];
      }
      var href = link.attr("href");
      href += (false !== href.indexOf("?") ? "&" : "?") + "only_body=1";
      // Если контент по данной ссылке ещё не загружен
      if (typeof document.quickviewPreload[href] == "undefined") {
        // Ставим отметку о том, что мы начали загрузку страницы товара
        document.quickviewPreload[href] = 1;
        // Делаем запрос на загрузку страницы товара
        $.get(href, function (content) {
          // Сохраняем контент, необходимый для быстрого просмотра в специально созданный для этого массив
          document.quickviewPreload[href] = $(content).getColumnContent();
        })
          // Если загрузить страницу не удалось, удаляем отметку о том, что мы подгрузили эту страницу
          .fail(function () {
            delete document.quickviewPreload[href];
          });
      }
    });
  });
  // Действие при нажатии на кнопку быстрого просмотра.
  $(function () {
    $(document).on("click", "a.quickview", function () {
      var href = $(this).attr("href");
      href += (false !== href.indexOf("?") ? "&" : "?") + "only_body=1";
      quickViewShow(href);
      return false;
    });
  });
}
// Быстрый просмотр товара
function quickViewShow(href, atempt) {
  // Если данные по быстрому просмотру уже подгружены
  if (typeof document.quickviewPreload[href] != "undefined") {
    // Если мы в режиме загрузки страницы и ждём результата от другой функции, то тоже подождём, когда тот контент загрузится и будет доступен в этом массиве.
    if (1 == document.quickviewPreload[href]) {
      // Если попытки ещё не указывались, ставим 0 - первая попытка
      if (typeof atempt == "undefined") {
        atempt = 0;
        // Иначе прибавляем счётчик попыток
      } else {
        atempt += 1;
        // Если больше 500 попыток, то уже прошло 25 секунд и похоже, что быстрый просмотр не подгрузится, отменяем информацию о том, что контент загружен
        if (atempt > 500) {
          delete document.quickviewPreload[href];
          // TODO сделать вывод красивой таблички
          alert("Не удалось загрузить страницу товара. Пожалуйста, повторите попытку позже.");
          return true;
        }
      }
      // Запустим функцию быстрого просмотра через 5 сотых секунды, вероятно запрошендная страница товара уже подгрузится.
      setTimeout('quickViewShow("' + href + '", ' + atempt + ")", 50);
      return true;
    } else {
      $.fancybox.close();
      var productShopContent = $(document.quickviewPreload[href]).find(".product-shop").length;

      $.fancybox({
        padding: 0,
        autoSize: true,
        width: "100%",
        maxWidth: 1100,
        wrapCSS: !productShopContent ? "quickView" : "",
        content: document.quickviewPreload[href],
        afterShow: function () {
          // Обновление доступности модификаций
          MainFunctions();
          AddCart();
          quantity();
        },
        beforeShow: function () {
          $(".fancybox-inner .product-view").removeClass("modification");
          if (productShopContent) {
            $(".fancybox-inner .product-view .product-order").addClass(
              "col-md-4 col-md-6 col-lg-3"
            );
            $(".fancybox-inner .product-view .product-shop").addClass("col-lg-5 col-md-6");
          } else {
            $(".fancybox-inner .product-view .product-order").addClass("col-md-6");
          }
        },
      });
    }
  } else {
    $.get(href, function (content) {
      $.fancybox.close();
      var productShopContent = $(document.quickviewPreload[href]).find(".product-shop").length;
      $.fancybox({
        padding: 0,
        autoSize: true,
        maxWidth: 960,
        wrapCSS: !productShopContent ? "quickView" : "",
        content: $(content).getColumnContent(),
        afterShow: function () {
          // Обновление доступности модификаций
          MainFunctions();
          AddCart();
          quantity();
          $(".product-img-box .product-image .general-img")
            .find("a")
            .attr("href", "javascript:void(0)");
        },
        beforeShow: function () {
          $(".fancybox-inner .product-view").removeClass("modification");
          if (productShopContent) {
            $(".fancybox-inner .product-view .product-order").addClass(
              "col-md-4 col-md-6 col-lg-3"
            );
            $(".fancybox-inner .product-view .product-shop").addClass("col-lg-5 col-md-6");
          } else {
            $(".fancybox-inner .product-view .product-order").addClass("col-md-6");
          }
        },
      });
    });
  }
}

// Функция Быстрого просмотра товара c модификацией
function quickViewMod() {
  // Действие при нажатии на кнопку в корзину товара c модификацией
  $(document).ready(function () {
    $(document).on("click", "a.quickviewmod", function () {
      var href = $(this).attr("href");
      href += (false !== href.indexOf("?") ? "&" : "?") + "only_body=1";
      quickViewShowMod(href);
      return false;
    });
  });
}
// Быстрый просмотр товара с модификацией
function quickViewShowMod(href, atempt) {
  // Если массив с подгруженными заранее карточками товара для быстрого просмотра ещё не создан - создадим его.
  if (typeof document.quickviewPreload == "undefined") {
    document.quickviewPreload = [];
  }
  // Если данные по быстрому просмотру уже подгружены
  if (typeof document.quickviewPreload[href] != "undefined") {
    // Если мы в режиме загрузки страницы и ждём результата от другой функции, то тоже подождём, когда тот контент загрузится и будет доступен в этом массиве.
    if (1 == document.quickviewPreload[href]) {
      // Если попытки ещё не указывались, ставим 0 - первая попытка
      if (typeof atempt == "undefined") {
        atempt = 0;
        // Иначе прибавляем счётчик попыток
      } else {
        atempt += 1;
        // Если больше 500 попыток, то уже прошло 25 секунд и похоже, что быстрый просмотр не подгрузится, отменяем информацию о том, что контент загружен
        if (atempt > 500) {
          delete document.quickviewPreload[href];
          // TODO сделать вывод красивой таблички
          alert("Не удалось загрузить страницу товара. Пожалуйста, повторите попытку позже.");
          return true;
        }
      }
      // Запустим функцию быстрого просмотра через 5 сотых секунды, вероятно запрошендная страница товара уже подгрузится.
      setTimeout('quickViewShowMod("' + href + '", ' + atempt + ")", 50);
      return true;
    } else {
      $.fancybox.close();
      var productShopContent = $(document.quickviewPreload[href]).find(".product-shop").length;

      $.fancybox({
        padding: 0,
        autoSize: true,
        maxWidth: 500,
        wrapCSS: !productShopContent ? "quickView" : "",
        content: document.quickviewPreload[href],
        beforeShow: function () {
          // Обновление доступности модификаций
          MainFunctions();
          AddCart();
          quantity();

          $(".fancybox-inner .product-view").addClass("modification");
          $(".fancybox-inner .product-view .product-shop").removeClass("col-lg-5 col-md-6");
          $(".fancybox-inner .product-view .product-order").removeClass(
            "col-md-4 col-md-6 col-lg-3"
          );
        },
      });
    }
  } else {
    $.get(href, function (content) {
      $.fancybox.close();
      var productShopContent = $(document.quickviewPreload[href]).find(".product-shop").length;
      $.fancybox({
        padding: 0,
        autoSize: true,
        maxWidth: 500,
        wrapCSS: !productShopContent ? "quickView" : "",
        content: $(content).getColumnContent(),
        beforeShow: function () {
          // Обновление доступности модификаций
          MainFunctions();
          AddCart();
          quantity();
          $(".product-img-box .product-image .general-img")
            .find("a")
            .attr("href", "javascript:void(0)");

          $(".fancybox-inner .product-view").addClass("modification");
          $(".fancybox-inner .product-view .product-shop").removeClass("col-lg-5 col-md-6");
          $(".fancybox-inner .product-view .product-order").removeClass(
            "col-md-4 col-md-6 col-lg-3"
          );
        },
      });
    });
  }
}

// Функция быстрого оформления заказа в корзине
function startOrder() {
  var globalOrder = $("#globalOrder");
  var closeOrder = $("#closeOrder"); // объект кнопки отмены заказа
  // Если форма уже открыта то ничего не делаем.
  if (globalOrder.css("display") != "none") {
    // Если блок с формой заказа не скрыт то выходим из функции
    return false;
  }
  //объект блока куда будет выводиться форма быстрого заказа
  var OrderAjaxBlock = $("#OrderAjaxBlock");
  // объект кнопки "Заказать"
  var buttonStartOrder = $("#startOrder");
  //объект блока с ajax анимацией
  var ajaxLoaderQuickOrder = $(".content-loading");
  var urlQuickForm = "/cart/add"; // адрес страницы с формой
  // данные которые отарвятся на сервер чтобы получить только форму быстрого заказа без нижней части и верхней части сайта
  var quickFormData = [
    { name: "ajax_q", value: 1 },
    { name: "fast_order", value: 1 },
  ];
  // Скрываем кнопку "Заказать"
  buttonStartOrder.hide();
  // Скрываем элементы в корзине
  $("#main .cart-info .cartForm").hide();
  $("#page-title .title-tab").toggleClass("disabled");
  // Отключаем возможность клика по неактивной кнопке
  $("#page-title .title-tab.disabled").prop("disabled", true);
  // Отключаем возможность редактирования формы
  var cartTable = $(".cartTable");
  // открываем общий, глобальный блок
  globalOrder.show().addClass("loading");
  $("html, body")
    .delay(400)
    .animate({ scrollTop: jQuery("#globalOrder").offset().top - 100 }, 800);
  // включаем gif анимацию загрузки
  ajaxLoaderQuickOrder.show();
  $.ajax({
    type: "POST",
    cache: false,
    url: urlQuickForm,
    data: quickFormData,
    success: function (data) {
      OrderAjaxBlock.html($(data).find(".quickformfast").wrap("<div></div>").html());
      $(".formfast").addClass("col-sm-12 col-md-8 col-xs-12");
      $(".formfast div.col").addClass("col-md-6 col-sm-12");
      $(".formfast-cart").hide();
      // Включаем возможность клика по неактивной кнопке
      $("#page-title .title-tab.disabled").prop("disabled", false);
      // скрываем блок с анимацией
      ajaxLoaderQuickOrder.hide();
      globalOrder.removeClass("loading");
      // раскрываем блок с формой
      OrderAjaxBlock.show();
      // удалим обработчик события на кнопке отмена
      $(".formfast-cart").css("display", "block");
      closeOrder.css("display", "block");
      cartTable.toggleClass("disable");
      q = cartTable.find(".cartqty");
      // if(q.prop('disabled') == true){q.prop('disabled',false)}else{q.prop('disabled',true)}
      quickOrderScripts();
      OrderScripts();
      coupons();
      address();
      ppModal();
      $("#closeOrder, #closeOrderTab")
        .off("click")
        .on("click", function () {
          // Если таб уже активен выходим
          if ($(this).hasClass("title-tab") && !$(this).hasClass("disabled")) {
            return;
          }
          //Скрываем блок оформления заказа
          ajaxLoaderQuickOrder.hide();
          OrderAjaxBlock.hide();
          globalOrder.hide();
          closeOrder.css("display", "none"); // Скрываем кнопку "Отменить"
          $("#main .cart-info .cartForm").show();
          $("#page-title .title-tab").toggleClass("disabled");
          buttonStartOrder.css("display", "block"); // Возвращаем кнопку "Заказать"
          // Включаем возможность редактирования формы
          cartTable.toggleClass("disable");
          // if(q.prop('disabled') == true){q.prop('disabled',false)}else{q.prop('disabled',true)}
          return false;
        });
    },
  });
  return false;
}

// Функция + - для товаров
function quantity() {
  //Regulator Up копки + в карточке товара при добавлении в корзину
  $(".qty-plus")
    .off("click")
    .click(function () {
      var quantity = $(this).parent().find(".quantity, .cartqty"),
        currentVal = parseInt(quantity.val());
      if (!isNaN(currentVal)) {
        quantity.val(currentVal + 1);
        quantity.trigger("change");
      }
      return false;
    });
  //Regulator Down копки - в карточке товара при добавлении в корзину
  $(".qty-minus")
    .off("click")
    .click(function () {
      var quantity = $(this).parent().find(".quantity, .cartqty"),
        currentVal = parseInt(quantity.val());
      if (!isNaN(currentVal) && !(currentVal <= 1)) {
        quantity.val(currentVal - 1);
        quantity.trigger("change");
      }
      return false;
    });
  // Если вводят 0 то заменяем на 1
  $(".qty-wrap .quantity")
    .off("change")
    .change(function () {
      if ($(this).val() < 1) {
        $(this).val(1);
      }
    });
}

// Скрипты для карточки товара
function goodspage() {
  counterDate();
  // Скролл по ссылкам
  $(".scroll-link").on("click", function (evt) {
    evt.preventDefault();
    var href = $(this).attr("href");
    var tabNumber = href.slice(-1);

    tabSwitch(tabNumber);
    $("html, body").animate({ scrollTop: jQuery(href).offset().top }, 700);
  });

  // Фильтр отзывов
  $(".goodsDataOpinionListNavigateTop > a").click(function () {
    var $btn = $(this);
    var $reviews = $btn.parent().next(".goodsDataOpinionList").find(".bord");

    $btn.addClass("active").siblings().removeClass("active");

    if ($btn.hasClass("goodOpinions")) {
      $reviews.filter(".good").fadeIn();
      $reviews.filter(".bad").hide();
    } else if ($btn.hasClass("badOpinions")) {
      $reviews.filter(".good").hide();
      $reviews.filter(".bad").fadeIn();
    } else {
      $reviews.fadeIn();
    }
  });

  // Добавление отзыва о товаре. Рейтинг
  if (typeof $(".goodsDataOpinionRating").rating == "function") {
    $(".goodsDataOpinionRating input").rating({
      split: 2,
      required: true,
    });
  }

  // Список отзывов о товаре. Ссылка на отображение формы для добавление отзыва о товаре
  $(".goodsDataOpinionShowAddForm").click(function () {
    if (0 == $("#goodsDataOpinionAddBlock:visible").length) {
      $("#goodsDataOpinionAddBlock").show("blind");
      $("html, body").animate({ scrollTop: jQuery(".goodsDataOpinionAddForm").offset().top }, 400);
    } else {
      $("#goodsDataOpinionAddBlock").hide("blind");
      $("html, body").animate({ scrollTop: jQuery(".goodsDataOpinion").offset().top - 60 }, 400);
      return false;
    }
  });

  // Добавление отзыва о товаре. кнопка reset скрывающая форму добавления отзыва о товаре
  $(".goodsDataOpinionFormReset").click(function () {
    $("#goodsDataOpinionAddBlock").hide("blind");
    $("html, body").animate({ scrollTop: jQuery(".goodsDataOpinion").offset().top - 60 }, 400);
    return false;
  });

  // Иконка для обновления изображение капчи
  $(".goodsDataOpinionCaptchaRefresh").click(function () {
    RefreshImageAction(this, 1, 1);
    $(".goodsDataOpinionCaptchaImg").attr(
      "src",
      $(".goodsDataOpinionCaptchaImg").attr("src") + "&rand" + Math.random(0, 10000)
    );
    return false;
  });

  // С этим товаром смотрят
  $(".related-views .products-grid").owlCarousel({
    items: 4,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navContainer: ".related-views .navigation",
    navText: [,],
    navText: [
      "<i class='slideshow-nav fal fa-angle-left' aria-hidden='true'></i>",
      "<i class='slideshow-nav fal fa-angle-right' aria-hidden='true'></i>",
    ],
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0: { items: 1 },
      320: { items: 1 },
      480: { items: 1 },
      540: { items: 2 },
      768: { items: 3 },
      992: { items: 3 },
      1200: { items: 5 },
    },
    onInitialized: changeNavBtn,
  });
  // Сопутствующие товары
  $(".related-goods .products-grid").owlCarousel({
    items: 4,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navContainer: ".related-goods .navigation",
    navText: [,],
    navText: [
      "<i class='slideshow-nav fal fa-angle-left' aria-hidden='true'></i>",
      "<i class='slideshow-nav fal fa-angle-right' aria-hidden='true'></i>",
    ],
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0: { items: 1 },
      320: { items: 1 },
      480: { items: 1 },
      540: { items: 2 },
      768: { items: 3 },
      992: { items: 3 },
      1200: { items: 5 },
    },
    onInitialized: changeNavBtn,
  });
  function changeNavBtn(event) {
    var items = event.item.count;
    var size = event.page.size;
    var $nav = $(event.target).prev(".block-title").find(".navigation");

    if (items > size) {
      $nav.show();
    } else {
      $nav.hide();
    }
  }
}

// Скрипты для изображения товара
function goodsImage() {
  // Другие изображения товара
  $(function () {
    var owl = $(".thumblist-box .owl-carousel");
    // Показывать\Скрывать навигацию
    owl.on("initialized.owl.carousel changed.owl.carousel", function (event) {
      var items = event.item.count;
      var size = event.page.size;
      if (items > size) {
        $(".thumblist-box.navigation .prev, .thumblist-box.navigation .next").show();
      } else {
        $(".thumblist-box.navigation .prev, .thumblist-box.navigation .next").hide();
      }
    });
    owl.owlCarousel({
      items: 3,
      margin: 15,
      loop: false,
      rewind: true,
      lazyLoad: false,
      nav: false,
      dots: false,
      autoplay: false,
      autoplayHoverPause: true,
      smartSpeed: 500,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      responsiveClass: true,
      responsiveRefreshRate: 100,
      responsive: {
        0: { items: 1 },
        320: { items: 2 },
        480: { items: 3 },
        640: { items: 4 },
        768: { items: 5 },
        992: { items: 2 },
        1200: { items: 3 },
      },
    });
    // Кнопки навигации
    $(".thumblist-box.navigation .next").click(function (event) {
      event.preventDefault();
      owl.trigger("next.owl.carousel");
    });
    $(".thumblist-box.navigation .prev").click(function (event) {
      event.preventDefault();
      owl.trigger("prev.owl.carousel");
    });
  });

  // Увеличение изображения при нажатии изображение
  $(function () {
    $('a[rel="gallery"]').fancybox();
    // Увеличение изображение при клике на него и открытие галереи изображений
    $(".goodsImageZoom a, .thumblist a").click(function () {
      if ($(this).closest(".thumblist").length) {
        $(".goodsImageZoom").attr("data", $(this).attr("data"));
        return true;
      }
      $('.goodsImageList a[data="' + $(".goodsImageZoom").attr("data") + '"]').trigger("click");
      return false;
    });
    // Увеличение при нажатии на кнопку
    $("#zoom1").click(function (event) {
      event.preventDefault();
      $(
        'div.owl-carousel a[data-image-id="' + parseInt($("div.goodsImageZoom").attr("data")) + '"]'
      ).click();
    });
  });
}

// Удаление товара из Сравнения без обновлении страницы
function removeFromCompare(e) {
  if (confirm("Вы точно хотите удалить товар из сравнения?")) {
    var del = e;
    var num = $(".compare .count").text();
    e.parent().fadeOut().remove();
    url = del.data("href");
    goodsModId = $(del).attr("data-goods-mod-id");
    $.ajax({
      cache: false,
      url: url,
      success: function (d) {
        var oldCount = num;
        var newCount = oldCount - 1;
        $(".compare .count").text(newCount);
        var flag = 0;

        if (newCount != 0) {
          $("#compare-items li.item").each(function () {
            if (flag == 0) {
              if ($(this).css("display") == "none") {
                $(this).show();
                flag++;
              }
            }
          });
        } else {
          $(".compare").removeClass("have-items");
          $(".compare #compare-items .empty").show();
          $(".compare .actions").hide();
        }
        var obj = $('.add-compare[data-mod-id="' + goodsModId + '"]');
        if (obj.length) {
          obj
            .attr("data-action-is-add", "1")
            .removeAttr("title")
            .removeClass("added")
            .attr(
              "href",
              obj
                .attr("href")
                .replace(obj.attr("data-action-delete-url"), obj.attr("data-action-add-url"))
            );
        }
      },
    });
  }
}

// Удаление ВСЕХ товаров из Сравнения без обновлении страницы
function removeFromCompareAll(e) {
  if (confirm("Вы точно хотите очистить корзину?")) {
    var del = e;
    url = del.data("href");

    $.ajax({
      cache: false,
      url: url,
      success: function (d) {
        // Очищаем активные кнопки сравнения на товарах
        $(".compare #compare-items .item .item-remove").each(function () {
          var goodsModId = $(this).attr("data-goods-mod-id");
          var obj = $('.add-compare[data-mod-id="' + goodsModId + '"]');

          if (obj.length) {
            obj
              .attr("data-action-is-add", "1")
              .removeAttr("title")
              .removeClass("added")
              .attr(
                "href",
                obj
                  .attr("href")
                  .replace(obj.attr("data-action-delete-url"), obj.attr("data-action-add-url"))
              );
          }
        });

        $(".compare").removeClass("have-items");
        $(".compare .count").text("0");
        $(".compare .actions").hide();
        $(".compare #compare-items .item").remove();
        $(".compare #compare-items .empty").show();
        $(".add-compare").removeAttr("title").removeClass("added");
      },
    });
  }
}

// Удаление товара из Избранного без обновлении страницы
function removeFromFavorites(e) {
  if (confirm("Вы точно хотите удалить товар из избранного?")) {
    var del = e;
    var num = $(".favorites .count").text();
    e.parent().fadeOut().remove();
    url = del.data("href");
    goodsModId = $(del).attr("data-goods-mod-id");
    $.ajax({
      cache: false,
      url: url,
      success: function (d) {
        var oldCount = $(".favorites .count").text();
        var newCount = oldCount - 1;
        $(".favorites .count").text(newCount);
        var flag = 0;

        if (newCount != 0) {
          $("#favorites-items li.item").each(function () {
            if (flag == 0) {
              if ($(this).css("display") == "none") {
                $(this).show();
                flag++;
              }
            }
          });
        } else {
          $(".favorites").removeClass("have-items");
          $(".favorites #favorites-items .empty").show();
          $(".favorites .actions").hide();
        }
        var obj = $('.add-wishlist[data-mod-id="' + goodsModId + '"]');
        if (obj.length) {
          obj
            .attr("data-action-is-add", "1")
            .removeAttr("title")
            .removeClass("added")
            .attr(
              "href",
              obj
                .attr("href")
                .replace(obj.attr("data-action-delete-url"), obj.attr("data-action-add-url"))
            );
        }
      },
    });
  }
}

// Удаление ВСЕХ товаров из Избранное без обновлении страницы
function removeFromFavoritesAll(e) {
  if (confirm("Вы точно хотите очистить избранное?")) {
    var del = e;
    url = del.data("href");

    $.ajax({
      cache: false,
      url: url,
      success: function (d) {
        // Очищаем активные кнопки избранное на товарах
        $(".favorites #favorites-items .item .item-remove").each(function () {
          var goodsModId = $(this).attr("data-goods-mod-id");
          var obj = $('.add-wishlist[data-mod-id="' + goodsModId + '"]');

          if (obj.length) {
            obj
              .attr("data-action-is-add", "1")
              .removeAttr("title")
              .removeClass("added")
              .attr(
                "href",
                obj
                  .attr("href")
                  .replace(obj.attr("data-action-delete-url"), obj.attr("data-action-add-url"))
              );
          }
        });

        $(".favorites").removeClass("have-items");
        $(".favorites .count").text("0");
        $(".favorites .actions").hide();
        $(".favorites #favorites-items .item").remove();
        $(".favorites #favorites-items .empty").show();
        $(".add-wishlist").removeAttr("title").removeClass("added");
      },
    });
  }
}

// Удаление товара из корзины без обновлении страницы
function removeFromCart(e) {
  if (confirm("Вы точно хотите удалить товар из корзины?")) {
    var del = e;
    e.parent().fadeOut().remove();
    url = del.data("href");
    quantity = del.data("count");

    $(".total-sum").animate({ opacity: 0 }, 500);
    $.ajax({
      cache: false,
      url: url,
      success: function (d) {
        var oldCount = $(".cart .count").text();
        var oldQuantity = quantity;
        var newCount = oldCount - oldQuantity;

        $(".cart .count").text(newCount);
        $(".total-sum").animate({ opacity: 1 }, 500);
        $(".total-sum").html($(d).find(".total-sum").html());
        var flag = 0;
        if (newCount != 0) {
          $(".cart-products-list li.item").each(function () {
            if (flag == 0) {
              if ($(this).css("display") == "none") {
                $(this).show();
                flag++;
              }
            }
          });
        } else {
          $(".header .cart .cart-content .cart-products-list").hide();
          $(".header .cart  .cart-content .subtotal").hide();
          $(".header .cart  .cart-content .actions").hide();
          $(".header .cart  .cart-content .empty").show();
        }
      },
    });
  }
}

// Удаление ВСЕХ товаров из Корзины без обновлении страницы
function removeFromCartAll(e) {
  event.preventDefault();
  if (confirm("Вы точно хотите очистить корзину?")) {
    var del = e;
    e.parent().fadeOut().remove();
    url = del.data("href");
    $.ajax({
      cache: false,
      url: url,
      success: function (d) {
        $(".cart .count").text("0");
        $(".header .cart  .cart-content .cart-products-list").hide();
        $(".header .cart  .cart-content .subtotal").hide();
        $(".header .cart  .cart-content .actions").hide();
        $(".header .cart  .cart-content .empty").show();
      },
    });
  }
}

// Корзина
function ajaxnewqty() {
  $(".cartqty").change(
    $.debounce(300, function () {
      s = $(this);
      id = $(this).closest("tr").data("id");
      qty = $(this).val();
      if (qty < 1) {
        s.val(1);
      }
      data = $(".cartForm").serializeArray();
      data.push({ name: "only_body", value: 1 });
      $('tr[data-id="' + id + '"] .ajaxtotal').css("opacity", "0");
      $(".TotalSum").css("opacity", "0");
      $.ajax({
        data: data,
        cache: false,
        success: function (d) {
          s.val(
            $(d)
              .find('tr[data-id="' + id + '"] .cartqty')
              .val()
          );
          $('tr[data-id="' + id + '"] .ajaxtotal').css("opacity", "1");
          $(".TotalSum").css("opacity", "1");
          tr = $('tr[data-id="' + id + '"]');
          tr.find(".ajaxtotal").html(
            $(d)
              .find('tr[data-id="' + id + '"] .ajaxtotal')
              .html()
          );
          $(".TotalSum").html($(d).find(".TotalSum").html());
          $(".discounttr").each(function () {
            $(this).remove();
          });
          $(d)
            .find(".discounttr")
            .each(function () {
              $(".cartTable tfoot tr:first-child").before($(this));
            });
          c = $(d).find('tr[data-id="' + id + '"] .cartqty');
          qw = c.val();
          if (Number(qty) > Number(qw)) {
            $(".cartErr").remove();
            $(".cartTable").before(
              '<div class="cartErr warning">Вы пытаетесь положить в корзину товара больше, чем есть в наличии</div>'
            );
            $(".cartErr")
              .fadeIn(500)
              .delay(2500)
              .fadeOut(500, function () {
                $(".cartErr").remove();
              });
            $(".cartqty").removeAttr("readonly");
          }
        },
      });
    })
  );
}

// Удаление товара из корзины
function ajaxdelete(s) {
  var yep = confirm("Вы точно хотите удалить товар из корзины?");
  if (yep == true) {
    var closeimg = s;
    s.closest("tr").fadeOut();
    url = closeimg.data("href");
    $.ajax({
      url: url,
      cache: false,
      success: function (d) {
        $(".cart-info").html($(d).find(".cart-info").html());
        ajaxnewqty();
        quantity();
        $(".cartqty").first().trigger("change");
        $("#startOrder").on("click", function () {
          startOrder();
          return false;
        });
        // Если корзина пуста
        if ($(d).find(".attention").length) {
          $("#page-title .title").html("Корзина покупок пуста");
        }
      },
    });
  } else {
    return false;
  }
}

// Отправка купона при оформлении заказа
function coupons() {
  var $submitBtn = $(".coupons .coupon-btn");
  var $cuponInput = $("#quick_form_coupon_code");
  var $resetBtn = $(".coupons .coupon_clear");

  $submitBtn.click(function () {
    var url = "/order/stage/confirm";
    var val = $cuponInput.val();
    var orderSumDefaul = $('.coupons input[name="orderSumDefaul"]').val();
    // Получаем данные формы, которые будем отправлять на сервер
    var formData = $("#myform").serializeArray();
    formData.push({ name: "ajax_q", value: 1 });
    formData.push({ name: "only_body", value: 1 });
    formData.push({ name: "form[coupon_code]", value: val });
    $.ajax({
      type: "POST",
      cache: false,
      url: url,
      data: formData,
      success: function (data) {
        var $discountBlock = $(data).closest("#myform").find("tr.discount");
        var discountName = $discountBlock.find("td.name").text();
        var discountPercent = $discountBlock.find("td.percent").text();
        var $totalBlock = $(data).closest("#myform").find("tr.total");

        // Записываем название и размер скидки по купону
        $(".subtotal .discount .label").html(discountName);
        $(".subtotal .discount .price").html(discountPercent);
        // Получаем новую итоговую стоимость заказа
        var newTotalSum = $totalBlock.find("td.total-sum").data("total-sum");
        var TotalSum = $(".subtotal .total .total-sum").data("total-sum");

        if (newTotalSum >= TotalSum) {
          $cuponInput.addClass("error");
          $cuponInput.val("").attr("placeholder", "Купон не применён");
        }

        // Обновляем значение
        $(".subtotal .total .total-sum").data("total-sum", newTotalSum);
        // Получаем текущую стоимость выбранной доставки
        var deliverySum = $(".formfast-cart .subtotal .delivery-sum .num").text();
        // Считаем итоговую сумму заказа вместе с доставкой
        var totalPriceWithDelivery = String(parseInt(deliverySum) + Math.floor(newTotalSum));
        $(".formfast-cart .total-sum .num").text(addSpaces(totalPriceWithDelivery));
        // Считаем размер скидки
        var discountRub = String(Math.floor(orderSumDefaul) - Math.floor(newTotalSum));
        $(".coupons .couponBlockSale").toggleClass("active", discountRub > 0);
        console.log("discountRub", discountRub);
        if (discountRub > 0) {
          $(".subtotal .discount").show();
          $(".coupons .couponNum").text(addSpaces(discountRub));
        } else {
          $(".coupons .couponNum").text("0");
          $(".subtotal .discount").hide();
        }

        if (newTotalSum >= TotalSum) {
          $(".coupons .couponNum").text("0");
          $(".coupons .couponBlockSale").removeClass("active");
        }
      },
      error: function (data) {
        console.log("Возникла ошибка: Невозможно отправить форму купона.");
      },
    });
  });
  $cuponInput.on("input", function () {
    var $input = $(this);

    if ($input.val()) {
      $input.next(".coupon_clear").addClass("active");
      $submitBtn.removeClass("_disabled");
    } else {
      $input.next(".coupon_clear").removeClass("active");
      $submitBtn.addClass("_disabled");
    }
  });
  $resetBtn.on("click", function () {
    $("#quick_form_coupon_code").val("").trigger("input");
    $(".coupons .coupon-btn").trigger("click");
  });
}

// Наверх
$(function () {
  // hide #back-top first
  $("#back-top").hide();
  // fade in #back-top
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $("#back-top").fadeIn();
    } else {
      $("#back-top").fadeOut();
    }
  });
  // scroll body to 0px on click
  $("#back-top").click(function () {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      800
    );
    return false;
  });
});

// Инициализация табов на странице товара
function initTabs() {
  // Блок в котором находятся табы
  var tabBlock = $(".product-tabs");
  if (!tabBlock.length) {
    return false;
  }
  // По умолчанию делаем отметку о том что активного таба не найдено
  var isFind = 0;
  tabBlock.find(".tabs a").each(function (i) {
    // Если нашёлся активный там
    if ($(this).hasClass("active")) {
      // Инициализируем найденный таб
      $(this).click();
      // Ставим отметку, о том что не нужно инициализировать первый таб на странице
      isFind = 1;
    }
  });
  // Если не найдено ни одного таба с отметкой о том что он активен
  if (!isFind) {
    // Ставим активным первый таб на странице.
    var tab = $("ul.tabs > li > a").attr("id").slice(-1);
    tabSwitch(tab, true);
  }
  // Проверяет хэш и если по нему была открыта вкладка, то эта функция автоматически откроет её.
  checkTabHash();
  // Если текущий адрес страницы предполагает добавление отзыва
  if ("#goodsDataOpinionAdd" == document.location.hash) {
    $("#goodsDataOpinionAddBlock").show();
    $("html, body").animate({ scrollTop: jQuery(".goodsDataOpinion").offset().top - 160 }, 400);
  } else if (document.location.hash.indexOf("show_tab_") !== -1) {
    var id = document.location.hash.slice(-1);

    if ($("#tab_" + id).length) {
      $("html, body").animate({ scrollTop: jQuery("#tab_" + id).offset().top - 10 }, 400);
    }
  }
  // Биндим изменение хэша - проверка какой таб нужно открыть.
  $(window).bind("hashchange", function () {
    checkTabHash();
  });
}

// Проверяет хэш, переданый пользователем и открывает соответствующий раздел
function checkTabHash() {
  // Определяем текущий хэш страницы
  var hash = window.location.hash.substr(1);
  if (hash == "goodsDataOpinionAdd") {
    hash = "show_tab_4";
  }
  if (!hash.length || hash.indexOf("show_tab_") == -1) {
    return false;
  }
  // Открываем тот таб, который был указан в hash-е
  tabSwitch(hash.replace("show_tab_", ""));
}

// Выбор вкладки на странице товара
function tabSwitch(nb, noScroll) {
  var tabBlock = $(".product-tabs");
  tabBlock.find(".tabs a").removeClass("active");
  tabBlock.find("div.tab-content").hide();
  $("#tab_" + nb).addClass("active");
  $("#content_" + nb).show();
  if ("#goodsDataOpinionAdd" != document.location.hash && !noScroll) {
    // Записываем в хэш информацию о том какой таб сейчас открыт, для возможности скопировать и передать ссылку с открытым нужным табом
    document.location.hash = "#show_tab_" + nb;
  }
}

// Валидаторы для Имени и телефона
function validName() {
  var $input = $("#footer #callback_person");
  var name = $input.val();

  if (name != "") {
    $input.next(".name-error").remove();
    $input.removeClass("input--error");

    return true;
  } else {
    $input.next(".name-error").remove();
    $input.addClass("input--error");
    $input.after('<div class="name-error">Вы не указали ваше Имя</div>');

    return false;
  }
}
function validPhone() {
  var $input = $("#footer #callback_phone");
  var tel = $input.val();
  var check = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{5,10}$/.test(tel);

  if (check == true && check != "") {
    $input.next(".phone-error").remove();
    $input.removeClass("input--error");

    return true;
  } else {
    $input.next(".phone-error").remove();
    $input.addClass("input--error");
    $input.after('<div class="phone-error">Вы ввели неверный номер телефона</div>');

    return false;
  }
}
//Проверка телефона в обратном звонке.
function validCallBack() {
  var name = validName();
  var phone = validPhone();

  return name && phone;
}

// Валидаторы для Имени и телефона
function validNameC() {
  var $input = $("#fancybox-callback #callback_person_header");
  var name = $input.val();

  if (name != "") {
    $input.next(".name-error").remove();
    $input.removeClass("input--error");

    return true;
  } else {
    $input.next(".name-error").remove();
    $input.addClass("input--error");
    $input.after('<div class="name-error">Вы не указали ваше Имя</div>');

    return false;
  }
}
function validPhoneC() {
  var $input = $("#fancybox-callback #callback_phone_header");
  var tel = $input.val();
  var check = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{5,10}$/.test(tel);

  if (check == true && check != "") {
    $input.next(".phone-error").remove();
    $input.removeClass("input--error");

    return true;
  } else {
    $input.next(".phone-error").remove();
    $input.addClass("input--error");
    $input.after('<div class="phone-error">Вы ввели неверный номер телефона</div>');

    return false;
  }
}
//Проверка телефона в обратном звонке.
function validCallBackC() {
  var name = validNameC();
  var phone = validPhoneC();

  return name && phone;
}

// Валидаторы для Имени, Почты, Комментария
function validNameF() {
  var $input = $("#fancybox-feedback #feedback_name");
  var name = $input.val();

  if (name != "") {
    $input.next(".name-error").remove();
    $input.removeClass("input--error");

    return true;
  } else {
    $input.next(".name-error").remove();
    $input.addClass("input--error");
    $input.after('<div class="name-error">Вы не указали ваше Имя</div>');

    return false;
  }
}
function validEmailF() {
  var $input = $("#fancybox-feedback #feedback_email");
  var email = $input.val();
  var check = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i.test(email);

  if (check == true && check != "") {
    $input.next(".phone-error").remove();
    $input.removeClass("input--error");

    return true;
  } else {
    $input.next(".phone-error").remove();
    $input.addClass("input--error");
    $input.after('<div class="phone-error">Вы ввели неверную почту</div>');

    return false;
  }
}
function validCommentF() {
  var $input = $("#fancybox-feedback #feedback_message");
  var name = $input.val();

  if (name != "") {
    $input.next(".name-error").remove();
    $input.removeClass("input--error");

    return true;
  } else {
    $input.next(".name-error").remove();
    $input.addClass("input--error");
    $input.after('<div class="name-error">Вы не указали комментарий</div>');

    return false;
  }
}
//Проверка телефона в обратном звонке.
function validCallBackF() {
  var name = validNameF();
  var email = validEmailF();
  var comment = validCommentF();

  return name && email && comment;
}

// Разделение поле адрес на Улица, Дом, Квартира
function address() {
  $("#quickform .button").click(function () {
    var $quickDeliveryAddress = $("#quickDeliveryAddress"),
      quickDeliveryAddressStreetValue = $("#quickDeliveryAddressStreet").val(),
      quickDeliveryAddressHomeValue = $("#quickDeliveryAddressHome").val(),
      quickDeliveryAddressFlatValue = $("#quickDeliveryAddressFlat").val();

    if (!$quickDeliveryAddress.length) {
      return;
    }

    if (
      quickDeliveryAddressStreetValue != "" ||
      quickDeliveryAddressHomeValue != "" ||
      quickDeliveryAddressFlatValue != ""
    ) {
      if ($quickDeliveryAddress.val().match(/(.*)(улица)+(.*)/i)) {
        $quickDeliveryAddress.val(null);
      }
      $quickDeliveryAddress.val(
        "Улица: " +
          quickDeliveryAddressStreetValue +
          ", Дом/Корпус: " +
          quickDeliveryAddressHomeValue +
          ", Квартира: " +
          quickDeliveryAddressFlatValue
      );
      $(this).submit();
      return false;
    }
  });
}

// Функции для главной страницы
function indexPage() {
  // Отсчет даты до окончания акции
  counterDate();
  // Слайдер на главной
  var owlS = $("#slideshow .owl-carousel");
  owlS.owlCarousel({
    items: 1,
    loop: true,
    rewind: true,
    lazyLoad: true,
    nav: true,
    navText: [
      "<i class='slideshow-nav fal fa-angle-left' aria-hidden='true'></i>",
      "<i class='slideshow-nav fal fa-angle-right' aria-hidden='true'></i>",
    ],
    dots: true,
    autoplay: true,
    autoplayHoverPause: true,
    smartSpeed: 500,
    dotsSpeed: 400,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
  });
  // Преимущества
  $("#features .features-list").owlCarousel({
    items: 4,
    loop: false,
    rewind: true,
    lazyLoad: false,
    nav: false,
    dots: false,
    autoplay: false,
    smartSpeed: 500,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0: { items: 1 },
      320: { items: 1, margin: 5 },
      480: { items: 2, margin: 10 },
      1200: { items: 4, margin: 30, mouseDrag: false },
    },
  });
  // Клик по табам в блоке новости
  $("#news .tabs-headerList").on("click", ".tabs-headerLink", function (event) {
    event.preventDefault();

    var $link = $(this);
    var $parent = $link.parent(".tabs-headerItem");
    var tabId = $link.data("href");

    if ($parent.hasClass("active")) {
      return;
    }

    preloadShow($("#news .tabs-body .preloader"));

    $parent.addClass("active").siblings().removeClass("active");
    $("#news .tabs-body .tabs-content")
      .removeClass("active")
      .filter('[id="' + tabId + '"]')
      .addClass("active");
  });
  // Слайдер новостей (все новости без группировки)
  $("#news .all.owl-carousel").owlCarousel({
    items: 4,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    autoHeight: false,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      992: { items: 3 },
      1199: { items: 4 },
    },
  });
  // Слайдер новостей (группы)
  $("#news .owl-carousel").owlCarousel({
    items: 4,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    autoHeight: false,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    onRefresh: function (event) {
      var $preloader = $(event.target).closest(".tabs-body").find(".preloader");

      preloadHide($preloader);
    },
    responsiveClass: true,
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      992: { items: 3 },
      1199: { items: 4 },
    },
  });

  // Товары на главной
  $(".pdt-index .products-grid").owlCarousel({
    items: 5,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navContainer: ".pdt-index .navigation",
    navText: [,],
    navText: [
      "<i class='slideshow-nav fal fa-angle-left' aria-hidden='true'></i>",
      "<i class='slideshow-nav fal fa-angle-right' aria-hidden='true'></i>",
    ],
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0: { items: 1 },
      320: { items: 1 },
      480: { items: 1 },
      540: { items: 2 },
      768: { items: 3 },
      992: { items: 3 },
      1200: { items: 5 },
    },
    onInitialized: changeNavBtn,
  });

  // Новинки
  $(".pdt-new .products-grid").owlCarousel({
    items: 5,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navContainer: ".pdt-new .navigation",
    navText: [,],
    navText: [
      "<i class='slideshow-nav fal fa-angle-left' aria-hidden='true'></i>",
      "<i class='slideshow-nav fal fa-angle-right' aria-hidden='true'></i>",
    ],
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0: { items: 1 },
      320: { items: 1 },
      480: { items: 1 },
      540: { items: 2 },
      768: { items: 3 },
      992: { items: 3 },
      1200: { items: 5 },
    },
    onInitialized: changeNavBtn,
  });
  // Хиты
  $(".pdt-best .products-grid").owlCarousel({
    items: 5,
    loop: false,
    rewind: true,
    lazyLoad: true,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navContainer: ".pdt-best .navigation",
    navText: [,],
    navText: [
      "<i class='slideshow-nav fal fa-angle-left' aria-hidden='true'></i>",
      "<i class='slideshow-nav fal fa-angle-right' aria-hidden='true'></i>",
    ],
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0: { items: 1 },
      320: { items: 1 },
      480: { items: 1 },
      540: { items: 2 },
      768: { items: 3 },
      992: { items: 3 },
      1200: { items: 5 },
    },
    onInitialized: changeNavBtn,
  });
  // Распродажа
  $("#promo-block .pdt-sale .products-grid").owlCarousel({
    items: 1,
    loop: true,
    rewind: true,
    lazyLoad: true,
    nav: true,
    dots: false,
    autoplay: false,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navContainer: "#promo-block .pdt-sale .navigation",
    navText: [,],
    navText: [
      "<i class='slideshow-nav fal fa-angle-left' aria-hidden='true'></i>",
      "<i class='slideshow-nav fal fa-angle-right' aria-hidden='true'></i>",
    ],
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    onInitialized: function () {
      // Сумма скидки
      var $parent = $("#promo-block .pdt-sale");
      var $oldPrices = $parent.find(".old-price");

      if (!$oldPrices.length) {
        return;
      }

      $oldPrices.each(function (i, item) {
        var oldPrice = $(item).data("old-price");
        var nowPrice = Math.ceil($(item).next('.price[itemprop="price"]').attr("content"));
        var discount = String(oldPrice - nowPrice);
        var $discountBlock = $("<b>")
          .addClass("discount-block")
          .text("- " + addSpaces(discount));

        $(item).append($discountBlock);
      });
    },
  });

  function changeNavBtn(event) {
    var items = event.item.count;
    var size = event.page.size;
    var $nav = $(event.target).siblings(".block-title").find(".navigation");

    if (items >= size) {
      $nav.show();
    } else {
      $nav.hide();
    }
  }
}

// Отсчет даты до окончания акции
function counterDate() {
  // Устанавливаем дату обратного отсчета ММ-ДД-ГГ
  $(".sale-counter").each(function (i, el) {
    var end = $(el).attr("end");
    var countDownDate = new Date(end).getTime();
    // Обновление счетчика каждую секунду
    var x = setInterval(function () {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      // Вывод
      $(el).find(".days span").text(days);
      $(el).find(".hours span").text(hours);
      $(el).find(".minutes span").text(minutes);
      $(el).find(".seconds span").text(seconds);
      // Счетчик завершен
      if (distance < 0) {
        clearInterval(x);
        $(el).find("span").text("0");
      }
    }, 1000);
  });
}
// Предзагрузчик
function preloadHide(currentPreloader) {
  var $preloader = currentPreloader || $(".preloader"),
    $spinner = $preloader.find(".content-loading");
  $spinner.fadeOut();
  $preloader.delay(500).fadeOut("slow");
}

function preloadShow(currentPreloader) {
  var $preloader = currentPreloader || $(".preloader"),
    $spinner = $preloader.find(".content-loading");
  $spinner.show();
  $preloader.show();
}

// Адаптивное меню и каталог
function OpenMenu() {
  // Иконки в мобильной версии
  function headerIcons() {
    $(".header-icons").on("click", ".header-iconsItem", function (evt) {
      var $icon = $(this);
      var id = $icon.attr("data-target");
      var $icons = $icon.siblings();

      $icons.each(function (index, icon) {
        var id = $(icon).attr("data-target");

        $(icon).removeClass("active");
        $(id).slideUp();
      });

      $icon.toggleClass("active");
      $(id).slideToggle();
    });

    $(document).on("click", function (e) {
      if (getClientWidth() <= 991) {
        if (
          !$(e.target).parents(".header-top,._header-mobile").length &&
          !$(e.target).hasClass("_header-mobile")
        ) {
          $("._header-mobile").slideUp();
          $(".header-iconsItem").removeClass("active");
        }
      }
    });
  }
  headerIcons();

  // Основной каталог в шапке
  function headerCatalog() {
    var e,
      $headerCatalog = $(".header-catalog"),
      $catalogBtn = $(".header-catalogBtn"),
      $catalogMenu = $(".header-catalogMenu"),
      $catalogItem = $(".header-catalogItem"),
      $headerSubcatalog = $(".header-subcatalog"),
      $headerOverlay = $(".header-overlay");
    $headerCloseBtn = $(".header-closeBtn");

    $headerCatalog.hover(
      function () {
        if (getClientWidth() > 992) {
          e = setTimeout(function () {
            $catalogMenu.add($headerOverlay).addClass("_visible");
          }, 200);
        }
      },
      function () {
        if (getClientWidth() > 992) {
          clearTimeout(e),
            setTimeout(function () {
              $catalogMenu.add($headerOverlay).removeClass("_visible");
            }, 200);
        }
      }
    );
    $catalogItem.hover(
      function () {
        if (getClientWidth() > 992) {
          $(this).find(".header-catalogLink").addClass("hover");
          $(this).find($headerSubcatalog).addClass("_visible");
        }
      },
      function () {
        if (getClientWidth() > 992) {
          $(this).find(".header-catalogLink").removeClass("hover");
          $headerSubcatalog.removeClass("_visible");
        }
      }
    );
    // Мобильная версия
    $catalogBtn.click(function () {
      if (getClientWidth() <= 991) {
        $catalogMenu.add($headerOverlay).addClass("_visible"), $("body").addClass("modal-open");
      }
    }),
      $headerOverlay.add($headerCloseBtn).click(function () {
        if (getClientWidth() <= 991) {
          $catalogMenu.add($headerOverlay).removeClass("_visible"),
            $("body").removeClass("modal-open");
        }
      });
    $catalogMenu.on("click", ".parent .header-arrow", function (evt) {
      if (getClientWidth() <= 991) {
        evt.preventDefault();

        var $arrow = $(this);
        var $link = $arrow.parent();

        if ($arrow.hasClass("active")) {
          $arrow.removeClass("active");
          $link.removeClass("active").next(".sub").slideUp();
        } else {
          $arrow.addClass("active");
          $link.addClass("active").next(".sub").slideDown();
        }
      }
    });
  }
  headerCatalog();

  function removeActiveLinks() {
    if (getClientWidth() > 992) {
      var $headerCatalog = $(".header-catalogMenu");

      $headerCatalog
        .find(".header-catalogLink, .header-subcatalogTitle, .header-catalogMenu")
        .removeClass("active");
      $headerCatalog.find(".header-subcatalog-third, .sub").show();
    }
  }
  $(window).on("resize", $.debounce(300, removeActiveLinks));
}

// Загрузка основных функций шаблона
$(function () {
  MainFunctions();
  outFunctions();
  ajaxnewqty();
  AddCart();
  Addto();
  quantity();
  OpenMenu();
  ppModal();
  quickViewMod();
});

// Запуск основных функций для разных разрешений экрана
$(function () {
  if (getClientWidth() > 767) {
    quickView();
  }
  // Запуск функций при изменении экрана
  $(window).resize(function () {
    if (getClientWidth() > 767) {
      quickView();
    }
  });
});

// Политика конфиденциальности в модальном окне
function ppModal() {
  $(".pp a").click(function (event) {
    event.preventDefault();
    var data = $("#fancybox-pp").html();
    $.fancybox({
      autoSize: true,
      maxWidth: 700,
      padding: 15,
      content: data,
    });
  });
}
// Модальное окно
$(function () {
  function modal() {
    if (!$.cookie("modal")) {
      // Если cookie не установлено появится окно с задержкой 3 секунды
      var delay = 3000;
      var data = $("#fancybox-popup").html();
      setTimeout(function () {
        $.fancybox({
          autoSize: true,
          maxWidth: 700,
          padding: 15,
          content: data,
        });
      }, delay);

      // Запоминаем в куках, что посетитель уже заходил
      $.cookie("modal", true, {
        // Время хранения cookie в днях
        expires: 1,
        path: "/",
      });
    }
  }
  // Уберите комментарии // со строчек ниже для запуска
  // modal();
});
// Баннер уведомления
$(function () {
  function banner() {
    // Если в куках нет записи
    if (!$.cookie("banner-top")) {
      var $bannerTop = $(".banner-top");
      // Показываем баннер
      $bannerTop.show();

      $(".banner-top .banner-top-closeBtn").on("click", function () {
        // Скрываем баннер
        $bannerTop.hide();
        // Запоминаем в куках, что посетитель уже заходил
        $.cookie("banner-top", true, {
          // Время хранения cookie в днях
          expires: 1,
          path: "/",
        });
      });
    }
  }
  // Уберите комментарии // со строчек ниже для запуска
  // banner();
});
// Форма поиска ( Сразу же помечаем объект поиска, как инициализированный, чтобы случайно не инициализировать его дважды.)
function SearchFieldInit(obj) {
  // Блок в котором лежит поле поиска
  obj.f_search = obj.find(".search-form");
  // Если поля поиска не нашлось, завершаем работу, ничего страшного.
  if (0 == obj.f_search.length) {
    return false;
  }
  // Поле поиска товара
  obj.s_search = obj.f_search.find(".search-input");
  // Обнуление данных в форме поиска
  obj.s_reset = obj.f_search.find(".search-reset");
  // Проверка на существование функции проверки поля и действий с ним
  if (typeof obj.SearchFieldCheck != "function") {
    console.log("function SearchFieldCheck is not found in object for SearchFieldInit", {
      status: "error",
    });
    return false;
    // Проверка, сколько полей поиска нам подсунули за раз на инициализацию
  } else if (1 < obj.f_search.length) {
    console.log("function SearchFieldInit must have only one search object", { status: "error" });
    return false;
  }
  // Создаём функцию которая будет отвечать за основные действия с полем поиска
  obj.__SearchFieldCheck = function (isAfter) {
    // Если в поле текста есть вбитые данные
    if (obj.s_search.val().length) {
      obj.f_search.addClass("search__filled");
    } else {
      obj.f_search.removeClass("search__filled");
    }
    // При нажатии клавиши данных внутри поля ещё нет, так что проверки вернут информацию что менять поле не нужно, хотя как только операция будет завершена данные в поле появятся. Поэтому произведём вторую проверку спустя 2 сотых секунды.
    if (typeof isAfter == "undefined" || !isAfter) {
      setTimeout(function () {
        obj.__SearchFieldCheck(1);
      }, 20);
    } else {
      return obj.SearchFieldCheck();
    }
  };
  // Действия с инпут полем поиска
  obj.s_search
    .click(function () {
      obj.__SearchFieldCheck();
    })
    .focus(function () {
      obj.f_search.addClass("search__focused");
      obj.__SearchFieldCheck();
    })
    .blur(function () {
      obj.f_search.removeClass("search__focused");
      obj.__SearchFieldCheck();
    })
    .keyup(function (I) {
      switch (I.keyCode) {
        // игнорируем нажатия на эти клавишы
        case 13: // enter
        case 27: // escape
        case 38: // стрелка вверх
        case 40: // стрелка вниз
          break;

        default:
          obj.f_search.removeClass("search__focused");
          obj.__SearchFieldCheck();
          break;
      }
    })
    .bind("paste", function (e) {
      obj.__SearchFieldCheck();
      setTimeout(function () {
        obj.__SearchFieldCheck();
      }, 20);
    })
    .bind("cut", function (e) {
      $("#search-result").hide();
      $("#search-result .inner .result-item").remove();
      obj.__SearchFieldCheck();
    });
  //Считываем нажатие клавиш, уже после вывода подсказки
  var suggestCount;
  var suggestSelected = 0;

  function keyActivate(n) {
    var $links = $("#search-result .result-item a");
    $links.eq(suggestSelected - 1).removeClass("_active");

    if (n == 1 && suggestSelected < suggestCount) {
      suggestSelected++;
    } else if (n == -1 && suggestSelected > 0) {
      suggestSelected--;
    }
    if (suggestSelected > 0) {
      $links.eq(suggestSelected - 1).addClass("_active");
    }
  }
  obj.s_search.keydown(function (I) {
    switch (I.keyCode) {
      // По нажатию клавиш прячем подсказку
      case 27: // escape
        $("#search-result").hide();
        return false;
        break;
      // Нажатие enter при выделенном пункте из поиска
      case 13: // enter
        if (suggestSelected) {
          var $link = $("#search-result .result-item")
            .eq(suggestSelected - 1)
            .find("a");
          var href = $link.attr("href");
          if (href) {
            document.location = href;
          } else {
            $link.trigger("click");
          }
          return false;
        }
        break;
      // делаем переход по подсказке стрелочками клавиатуры
      case 38: // стрелка вверх
      case 40: // стрелка вниз
        I.preventDefault();
        suggestCount = $("#search-result .result-item").length;
        if (suggestCount) {
          //делаем выделение пунктов в слое, переход по стрелочкам
          keyActivate(I.keyCode - 39);
        }
        break;
      default:
        suggestSelected = 0;
        break;
    }
  });

  // Кнопка обнуления данных в форме поиска
  obj.s_reset.click(function () {
    obj.s_search.val("").focus();
    $("#search-result").hide();
    $("#search-result .inner .result-item").remove();
  });
  // Проверка данных в форме после инициализации функционала. Возможно браузер вставил туда какой-либо текст, нужно обработать и такой вариант
  obj.__SearchFieldCheck();
}
// Аналог php функции.
function htmlspecialchars(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function substr(str, start, len) {
  str += "";
  var end = str.length;
  if (start < 0) {
    start += end;
  }
  end = typeof len === "undefined" ? end : len < 0 ? len + end : len + start;
  return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end);
}
function md5(str) {
  var xl;
  var rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  };
  var addUnsigned = function (lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = lX & 0x80000000;
    lY8 = lY & 0x80000000;
    lX4 = lX & 0x40000000;
    lY4 = lY & 0x40000000;
    lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) {
      return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      } else {
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  };
  var _F = function (x, y, z) {
    return (x & y) | (~x & z);
  };
  var _G = function (x, y, z) {
    return (x & z) | (y & ~z);
  };
  var _H = function (x, y, z) {
    return x ^ y ^ z;
  };
  var _I = function (x, y, z) {
    return y ^ (x | ~z);
  };
  var _FF = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var _GG = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var _HH = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var _II = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var convertToWordArray = function (str) {
    var lWordCount;
    var lMessageLength = str.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = new Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] =
        lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };
  var wordToHex = function (lValue) {
    var wordToHexValue = "",
      wordToHexValue_temp = "",
      lByte,
      lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = "0" + lByte.toString(16);
      wordToHexValue =
        wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  };
  var x = [],
    k,
    AA,
    BB,
    CC,
    DD,
    a,
    b,
    c,
    d,
    S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22,
    S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20,
    S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23,
    S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;
  str = this.utf8_encode(str);
  x = convertToWordArray(str);
  a = 0x67452301;
  b = 0xefcdab89;
  c = 0x98badcfe;
  d = 0x10325476;
  xl = x.length;
  for (k = 0; k < xl; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = _FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = _FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = _FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = _FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = _FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = _FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = _FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = _FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = _FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = _GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = _GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = _GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = _GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = _GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = _GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = _GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = _GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = _GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = _GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = _HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = _HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = _HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = _HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = _HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = _HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = _HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = _HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = _HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = _HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = _II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = _II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = _II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = _II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = _II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = _II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = _II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = _II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = _II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = _II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = _II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = _II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = _II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = _II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = _II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
  return temp.toLowerCase();
}
function utf8_encode(argString) {
  var string = argString + "";
  var utftext = "";
  var start, end;
  var stringl = 0;
  start = end = 0;
  stringl = string.length;
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;
    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
    } else {
      enc =
        String.fromCharCode((c1 >> 12) | 224) +
        String.fromCharCode(((c1 >> 6) & 63) | 128) +
        String.fromCharCode((c1 & 63) | 128);
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }
  if (end > start) {
    utftext += string.substring(start, string.length);
  }
  return utftext;
}
function rand(min, max) {
  var argc = arguments.length;
  if (argc === 0) {
    min = 0;
    max = 2147483647;
  } else if (argc === 1) {
    throw new Error("Warning: rand() expects exactly 2 parameters, 1 given");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Получить md5 хэш
function GenMd5Hash() {
  return substr(md5(parseInt(new Date().getTime() / 1000, 10)), rand(0, 24), 8);
}
// Живой поиск
$(function () {
  // Навигационная таблица над таблицей с данными
  var searchBlock = $(".search");
  var options = {
    target: "form.store_ajax_catalog",
    url: "/admin/store_catalog",
    items_target: "#goods",
    last_search_query: "",
  };
  // По этому хэшу будем обращаться к объекту извне
  var randHash = GenMd5Hash();
  // Если объекта со списком ajax функций не существует, создаём её
  if (typeof document.SearchInCatalogAjaxQuerySender == "undefined") {
    document.SearchInCatalogAjaxQuerySender = {};
  }
  // Поле поиска обновилось, внутри него можно выполнять любые действия
  searchBlock.SearchFieldCheck = function () {
    // Отменяем выполнение последнего запущенного через таймаут скрипта, если таковой был.
    if (typeof document.lastTimeoutId != "undefined") {
      clearTimeout(document.lastTimeoutId);
    }
    document.lastTimeoutId = setTimeout(
      "document.SearchInCatalogAjaxQuerySender['" +
        randHash +
        "']('" +
        htmlspecialchars(searchBlock.s_search.val()) +
        "');",
      300
    );
  };
  // Отправляет запрос к серверу с задачей поиска товаров
  document.SearchInCatalogAjaxQuerySender[randHash] = function (old_val) {
    var last_search_query_array = [];

    // sessionStorage is available
    if (typeof sessionStorage !== "undefined") {
      try {
        if (sessionStorage.getItem("lastSearchQueryArray")) {
          last_search_query_array = JSON.parse(sessionStorage.getItem("lastSearchQueryArray"));

          // Находим соответствие текущего запроса с sessionStorage
          var currentSearch = $.grep(last_search_query_array, function (item) {
            return item.search_query == old_val;
          })[0];

          if (currentSearch) {
            showDropdownSearch(JSON.parse(currentSearch.content));

            return;
          }
        } else {
          sessionStorage.setItem("lastSearchQueryArray", "[]");
        }
      } catch (e) {
        // sessionStorage is disabled
      }
    }

    // Если текущее значение не изменилось спустя 300 сотых секунды и это значение не то по которому мы искали товары при последнем запросе
    if (
      htmlspecialchars(searchBlock.s_search.val()) == old_val &&
      searchBlock.s_search.val().length > 1
    ) {
      // Запоминаем этот запрос, который мы ищем, чтобы не произвводить повторного поиска
      options["last_search_query"] = old_val;
      // Добавляем нашей форме поиска поле загрузки
      searchBlock.f_search.addClass("search__loading");
      // Собираем параметры для Ajax запроса
      var params = {
          ajax_q: 1,
          goods_search_field_id: 0,
          q: options["last_search_query"],
        },
        // Объект со значением которого будем в последствии проверять полученные от сервера данные
        search_field_obj = searchBlock.s_search;
      // Аяксом отправляем запрос на поиск нужных товаров и категорий
      $.ajax({
        type: "POST",
        cache: false,
        url: searchBlock.f_search.attr("action"),
        data: params,
        dataType: "json",
        beforeSend: function () {
          searchBlock
            .find(".search-submit .header-searchIcon")
            .html('<i class="fal fa-circle-notch fa-spin"></i>');
        },
        success: function (data) {
          // Если набранный запрос не соответствует полученным данным, видимо запрос пришёл не вовремя, отменяем его.
          if (search_field_obj.val() != old_val) {
            return false;
          }

          // Записываем в sessionStorage
          if (typeof sessionStorage !== "undefined") {
            try {
              sessionStorage.setItem(
                "lastSearchQueryArray",
                JSON.stringify(last_search_query_array)
              );

              // Находим соответствие текущего запроса с sessionStorage
              var currentSearch = $.grep(last_search_query_array, function (item) {
                return item.search_query == old_val;
              })[0];
              //Если такого запроса ещё не было запишем его в sessionStorage
              if (typeof currentSearch == "undefined") {
                // Добавляем в массив последних запросов данные по текущему запросу
                last_search_query_array.push({
                  search_query: old_val,
                  content: JSON.stringify(data),
                });
                sessionStorage.setItem(
                  "lastSearchQueryArray",
                  JSON.stringify(last_search_query_array)
                );
              }
            } catch (e) {
              // sessionStorage is disabled
            }
          }
          // Показываем результаты на основе пришедших данных
          showDropdownSearch(data);

          // Убираем информацию о том что запрос грузится.
          searchBlock.f_search.removeClass("search__loading");
          searchBlock
            .find(".search-submit .header-searchIcon")
            .html('<i class="fal fa-search"></i>');
          console.log("andAJAX");
        },
      });
    } else {
      $("#search-result").removeClass("_active").hide();
    }

    function showDropdownSearch(data) {
      // Отображение категорий в поиске
      if (data.category.length != undefined && data.category.length > 0) {
        $(".result-category .result-item").remove();
        $("#search-result").removeClass("_active").hide();
        for (с = 0; с < data.category.length; с++) {
          // Проверка наличия изображения
          if (data.category[с].image_icon == null) {
            data.category[с].image_icon = "/design/no-photo-icon.png";
          } else {
            data.category[с].image_icon = data.category[с].image_icon;
          }
          // Отображаем результат поиска
          $("#search-result").addClass("_active").show();
          $("#search-result .inner .result-category").append(
            '<div class="result-item" data-id="' +
              data.category[с].goods_cat_id +
              '"><a href="' +
              data.category[с].url +
              '"><img src="' +
              data.category[с].image_icon +
              '" class="goods-image-icon" /><span>' +
              data.category[с].goods_cat_name +
              "</span></a></div>"
          );
        }
      } else {
        $(".result-category .result-item").remove();
        $("#search-result").removeClass("_active").hide();
      }
      // Отображение товаров в поиске
      if (data.goods.length != undefined && data.goods.length > 0) {
        $(".result-goods .result-item").remove();
        $("#search-result").removeClass("_active").hide();
        for (i = 0; i < data.goods.length; i++) {
          // Проверка наличия изображения
          if (data.goods[i].image_icon == null) {
            data.goods[i].image_icon = "/design/no-photo-icon.png";
          } else {
            data.goods[i].image_icon = data.goods[i].image_icon;
          }
          // Отображаем результат поиска
          $("#search-result").addClass("_active").show();
          if (i <= 4) {
            $("#search-result .inner .result-goods").append(
              '<div class="result-item" data-id="' +
                data.goods[i].goods_id +
                '"><a href="' +
                data.goods[i].url +
                '"><img src="' +
                data.goods[i].image_icon +
                '" class="goods-image-icon" /><span>' +
                data.goods[i].goods_name +
                "</span></a></div>"
            );
          }

          // Если последняя итерация цикла вставим кнопку "показать все"
          if (i == data.goods.length - 1) {
            $("#search-result .inner #show-wrap").remove();

            var $showAllBtn = $("<a>")
              .text("Все результаты")
              .addClass("show-all")
              .click(function () {
                $(".search-form").submit();
              });
            var $showAllWrap = $("<div>")
              .attr("id", "show-wrap")
              .addClass("result-item")
              .append($showAllBtn);

            $("#search-result .inner .result-goods").append($showAllWrap);
          }
        }
      } else {
        $(".result-goods .result-item").remove();
        $("#search-result").removeClass("_active").hide();
      }
      // Скрываем результаты поиска если ничего не найдено
      if (data.category.length + data.goods.length > 0) {
        $("#search-result").addClass("_active").show();
        //   console.log("show");
      } else {
        $("#search-result").removeClass("_active").hide();
        //   console.log("hide");
      }

      if (data.category.length > 0) {
        $(".result-category").show().addClass("_visible");
      } else {
        $(".result-category").hide().removeClass("_visible");
      }

      if (data.goods.length > 0) {
        $(".result-goods").show();
      } else {
        $(".result-goods").hide();
      }
    }
  };
  SearchFieldInit(searchBlock);
});
