# Logging

## elasticSearch

 * [Девять граблей Elasticsearch, на которые я наступил](https://habr.com/company/yamoney/blog/419041/)
 * [Elasticsearch — поиск похожих слов](https://habr.com/post/433070/)
 * [Как переписать фасетный поиск с Solr на Elastic / Денис Сотников (Lamoda)](https://www.youtube.com/watch?v=uWWcCm5qWWU)

## logstash

## kibana

* [ELK стек](https://serveradmin.ru/ustanovka-i-nastroyka-elasticsearch-logstash-kibana-elk-stack/)
* [статья про elastic+kibana](https://habr.com/ru/company/yamoney/blog/419041/)

## [Heka](https://habrahabr.ru/company/yamoney/blog/328018/)

```
Что касается статуса продукта (deprecated) - для нас это не аргумент. Лук и стрелы для военных целей тоже deprecated, но это никак не мешает вам выстрелить кому-нибудь в голову с гарантированным результатом. Если же понадобится, например, нестандартный плагин или обработчик, то доработать продукт поможет целый штат опытных разработчиков.
```

```
Уже много лет проводим тесты по вопросу как быстрее парсить логи регэкспом. И много лет побеждает perl. Он создан для регулярок все таки. У нас объем меньше вашего, но и парсим мы только логи nginx.
Ansible проследит что бы везде был одинаковый формат. Syslog-ng направит поток из файла логов nginx на stdin парсера.
150 тысяч записей лога в минуту (многострочные данные мы считаем за одну запись) — в сумме со всех серверов дает <10%CPU нагрузки. 
``` 
