# Черновик

1. чем больше переносов строк, тем меньше конфликтов слияния
1. регулярно вычищать проблемы в логгере sentry
1. логировать ошибки взаимодействия со сторонними сервисами, например авторизация через фейсбушечку может не работать, если скрыт просмотр email в профиле
1. установить табличное выравнивание значений переменных, чтобы быстрее глазами отыскивать переменные по типу значений. Текст переменных сливается, т.к. одинаковый. При табличном выравнивании можно всегда пользоваться колоночным режимом редактирования(shift+alt+ins) 
	можно сразу найти цвет, 0, left, flex
	```stylus
	.c-nav-logo
		display       flex
		float         left
		padding-left  0px
		width         189px
		height        48px
		color         #820F10
	```
	
	```css
    	.c-nav-logo{
    		display       :flex;
    		float         :left;
    		padding-left  :0px;
    		width         :189px;
    		height        :48px;
    		color         :#820F10;
   		}
	```
1. Любая кнопка должна блокироваться до тех пор, пока действие этой кнопки обрабатывается
1. При создании новой страницы необходимо использовать компонентый подход. Он значительно сокращает объём кода, позволяет делать более мелкие задачи-итерации с взаимным контролем и тестированием.
	* Разбиваем дизайн на страницы, блоки, компоненты
	* Делаем заглушку-маршрут для страницы с новыми компонентами. Это быстрее, чем внедрять библиотеку компонентов, и позволяет легко учесть взаимодействие с унаследованным кодом.
	* Делаем маршруты и заглушки для новых страниц, блоков. Это важно сделать отдельно, т.к. создание компонентов и блоков более длительная задача. За это время легче получить в итоге 
		конфликт слияния в общих файлах с маршрутами или страницах с новыми блоками. Легче сразу для всех подобрать структуру именования компонентов, блоков, страниц.  
	* Делаем компоненты. Некоторые компоненты могут состоять из других, более простых компонентов. У каждого из них средствами Angular легко сделать опциональные параметры.
		Компонент - это отдельная папка с js+pug+less. 
		Для облегчения переопределения стилей необходимо использовать только классы в качестве селекторов. Вес селектора класс+тэг будет всегда выше. 
	* Делаем блоки на страницах.
	
1. 

Если обработка какого-либо действия вызывает задержу отображения на экране, то во время обработки показывать GIF-загрузку
Все значения из конфига должны иметь значения по умолчанию, исключением могут быть только пути
Воздерживаемся от прописывания обработки событий в html, кроме Google Analytics
Не смешивать в одной миграции запросы к разным базам

Back-end

Входные данные должны проверяться на бэке, даже если они проверяются на фронте

php
Избегать подавления ошибок с @


## вёрстка



 1. Сброс стилей:
	* убрать лишние общие стили, которые явно не используются. Например, я не уверен, что p+p будет удобно использовать, т.к. стиль абзаца зависит от размеров текста и контекста/блока. Вес(специфичность) такого селектора достаточно велика.
	* избегать использования названий тэгов в вкачестве селекторов стилей, т.к. тэги могут бытть изменены волевым решением. Если сильно надо, то их необходимо экранировать вложением в имена классов, но не ставить их в корень DOM.



 1. управляющие элементы необходимо размещать выше или на одном уровне с элементами отображающими состояние элемента. Поиск элемента вверх по дереву элементов только по идентификатору `window.document.querySelector('#id-itemName')`, т.е. по правилам css.

1. При сокрытии/показе элементов вместе с `display:none` использовать `display: flex` вместо `display:block`
 