Задача 188

Необходимо реализовать возможность подбора с подсказками, при вводе региона, района, населенного пункта, городского района, улицы, дома.

По примеру как работает сервисы:
- https://dadata.ru/suggestions/
- https://www.avito.ru/ - выбор города/региона

Чек-лист:
* сформировать в elasticsearch модель для поиска как в avito, модель должна содержать в себе id локаций из, которых составлена строка в том порядке, в котором локации представленны в строке
* выделить в строке стредствами elasticsearch компоненты строки, по которым найдено совпадение
* отсортировать результаты поиска по наилучшему совпадению
* получить дополнительную мета информацию для построения саджеста из mongodb (количество объявлений)
* транслитировать ввод английских букв в русские для qwerty-клавиатуры
* ограничить длину строки поиска из конфига
