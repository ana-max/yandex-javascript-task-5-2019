# Задача «Аркадию пора на лекцию»

## Основное задание

После небольшого медового месяца, Аркадий возвращается в мрачные стены университета — время слушать лекции и впитывать новые знания. В файле [index.js](./index.js) вас уже ждут студенты, готовые внимать каждому слову преподавателя:

```js
const students = {
    Sam: {
        focus: 100,
        wisdom: 50
    },
    Sally: {
        focus: 100,
        wisdom: 60
    }
};
```

И преподаватель Игорь, который вот-вот покажет первый слайд с бесценной информацией.

```js
const igor = getEmitter();
```

Студента можно подписать на события, инициируемые преподавателем (например, начало лекции или показ нового слайда) — то есть указать, какая функция (обработчик) должна быть вызвана при наступлении этого события.

```js
igor
    // Подписываем объект студента students.Sam на событие begin (начало лекции)
    .on('begin', students.Sam, function () {
        // Функция будет вызвана при наступлении события begin
        // Внутри функции мы получаем доступ к объекту через this
        this.focus += 10;
    })
    // Подписываем объект студента students.Sally на событие slide (новый слайд)
    .on('slide', students.Sally, function () {
        // Функция будет вызвана при наступлении события slide
        this.wisdom += 10;
    })
    // Отписывае объект студента students.Sally от события slide
    .off('slide', students.Sally);

igor
    // Инициируем событие begin (начало лекции)
    .emit('begin')
    // Инициируем событие slide (новый слайд)
    .emit('slide')
    // И ещё один slide
    .emit('slide');
```

Ваша задача — реализовать несколько методов:

* Подписка на событие — `on(event, context, handler)`
* Отписка от события — `off(event, context)`
* Инциация события — `emit(event)`

Вам также необходимо реализовать поддержку пространства имён для событий.

```js
const students = { ... };
const igor = getEmitter();

// Подписываем объект на событие slide (новый слайд)
lecturer.on('slide', students.Sam, function () {});

// Подписываем объект на событие slide.funny (новый смешной слайд)
lecturer.on('slide.funny', students.Sam, function () {});

igor
    // Инициируем событие slide (новый слайд)
    // Будут вызвана только первая функция
    .emit('slide')
    // Инициируем событие slide.funny (новый смешной слайд)
    // Будут вызвана и первая, и вторая функции
    .emit('slide.funny')
```

Примеры использования можно посмотреть в __index.js__ и в тестах.

#### Условия и ограничения

- Обработчики для одного и того же события вызываются **в порядке подписки**.
- Можно оформить неограниченное количество подписок на одно событие с одинаковым объектом и одинаковым обработчиком. Обработчики вызываются **в порядке подписки**.
- Пространства имён разделены **только точкой**
  - На событие `slide.funny` произойдут события `slide.funny` и `slide` именно в таком порядке (от наиболее специфичного события к наименее)
  - На событие `slidee` произойдет `slidee`, но не `slide`
  - Отписка от `slide.funny` отписывает только от него, но не от `slide`
  - Отписка от `slide` отписывает и от `slide`, и от `slide.funny`, и от `slide.funny.image` (то есть от самого события и от всех более специфичных событий)

Для решения задачи вам понадобятся:
- [Метод call](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
- [Метод apply](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

## Дополнительное задание (+12 к мудрости, +2 к фокусу)

> Перед выполнением внимательно прочитайте [про особенности выполнения дополнительных заданий](https://github.com/urfu-2019/guides/blob/master/workflow/extra.md)

Необходимо реализовать два дополнительных метода.

Оба метода работают аналогично `on`, но обладают некоторыми особенностями.

* `several` — подписывает на первые n событий
* `through` — подписывает на каждое n-ое событие, **начиная с первого**

При отрицательном или нулевом значении методы `through` и `several` просто работают как метод `on`!

Примеры использования этих методов можно также посмотреть в __index.js__ и в тестах.