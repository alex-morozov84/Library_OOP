export default class Customizator {
    constructor() {
        // создаем блок из двух кнопок с масштабами и одной кнопки выбора цвета
        this.btnBlock = document.createElement('div');
        this.colorPicker = document.createElement('input');

        // кнопка для сброса значений
        this.clear = document.createElement('div');

        // Получаем данные из Local Storage. Если там еще нечего нет,то получим значение по-умолчанию
        this.scale = localStorage.getItem('scale') || 1;
        this.color = localStorage.getItem('color') || '#ffffff';

        this.btnBlock.addEventListener('click', (e) => this.onScaleChange(e));
        this.colorPicker.addEventListener('input', (e) => this.onColorChange(e));
        this.clear.addEventListener('click', () => this.reset());
    }

    onScaleChange(e) {

        const body = document.querySelector('body');

        // проверяем, что кнопка, в которую ткнули, имеет параметр value
        if (e) {
            // получаем цифру масштаба из value (и удаляем букву x)
            this.scale = +e.target.value.replace(/x/g, '');
        }

        // Рекурсивная функция. Проверяет весь документ. Если находит текстовую ноду, при этом не пустую, то получает размер шрифта ее родителя
        const recursy = (element) => {
            element.childNodes.forEach(node => {
                // проверяем, что нода текстовая и не пустая. При помощи регулярного выражения убираем пробелы (для того, чтобы они не учитывались при подсчете количества символов)
                if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, "").length > 0) {

                    // если дата-атрибута еще нет (т.е. этого действия еще не производили)
                    if  (!node.parentNode.getAttribute('data-fs')) {
                         // для подходящей ноды получаем размер шрифта ее родителя
                        let value = window.getComputedStyle(node.parentNode, null).fontSize;
                        // создаем новый дата-атрибут и записываем в него исходный размер шрифта
                        node.parentNode.setAttribute('data-fs', +value.replace(/px/g, ""))
                        // умножаем размер шрифта на полученный из кнопки масштаб
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fs') * this.scale + "px";
                    // если исходный размер шрифта уже записывали в дата-атрибут
                    } else {
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fs') * this.scale + "px";
                    }
                   
                // иначе ищет дальше внутри данной ноды
                } else {
                    recursy(node);
                }
            });
        }

        recursy(body);

        localStorage.setItem('scale', this.scale);
    }

    onColorChange(e) {
        const body = document.querySelector('body');
        body.style.backgroundColor = e.target.value;

        localStorage.setItem('color', e.target.value);
    }

    // установка цвета фона из Local Storage
    setBgColor() {
        const body = document.querySelector('body');
        body.style.backgroundColor = this.color;
        this.colorPicker.value = this.color;
    }

    // метод для подстановки нужных стилей. Если вставлять их из CSS, то в каждый проект придется вставлять эти классы. При этом в innerHTML нельзя вставлять все в формате SCSS (надо подредактировать)
    injectStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            .panel {
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: fixed;
                top: 10px;
                right: 0;
                border: 1px solid rgba(0, 0, 0, 0.2);
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                width: 300px;
                height: 60px;
                background-color: #fff; }
            
            .scale {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 100px;
                height: 40px; }
                .scale_btn {
                display: block;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                font-size: 18px; }
            
            .color {
                width: 40px;
                height: 40px; }

            .clear {
                font-size: 20px;
                cursor: pointer;
            }
        `;

        // подключаем новые стили на страницу
        document.querySelector('head').appendChild(style);
    }

    // сброс на значения по-умолчанию
    reset() {
        // очищаем localStorage
        localStorage.clear();

        this.scale = 1;
        this.color = '#ffffff';

        this.setBgColor();
        this.onScaleChange();
    }

    render() {

        // вызываем метод, подключающий стили
        this.injectStyle();

        // вызываем метод, отображающий цвет фона из LocalStorage. Либо дефолтное значение, либо то, что было ранее туда записано
        this.setBgColor();

        this.onScaleChange();

        // создаем кнопки (в виде инпутов) и главную панель
        let scaleInputS = document.createElement('input'),
            scaleInputM = document.createElement('input'),
            panel = document.createElement('div');

        // добавляем кнопки на главную панель
        panel.append(this.btnBlock, this.colorPicker, this.clear);
        // вставляем "крестик"
        this.clear.innerHTML = "&times";
        this.clear.classList.add('clear');


        // добавляем стили, заданные в css
        scaleInputS.classList.add('scale_btn');
        scaleInputM.classList.add('scale_btn');
        this.btnBlock.classList.add('scale');
        this.colorPicker.classList.add('color');

        // меняем типы инпутов и задаем им дефолтные значения
        scaleInputS.setAttribute('type', 'button');
        scaleInputS.setAttribute('value', '1x');
        scaleInputM.setAttribute('type', 'button');
        scaleInputM.setAttribute('value', '1.5x');
        this.colorPicker.setAttribute('type', 'color');
        this.colorPicker.setAttribute('value', '#ffffff');

        this.btnBlock.append(scaleInputS, scaleInputM);

        panel.classList.add('panel');

        document.querySelector('body').append(panel);
    }
}