
const $btn = document.querySelector('#scan-btn');
const $btn_1 = document.querySelector('#scan-btn-1');
const $auth_href = document.querySelector('#auth-href');
const $btn3 = document.querySelector('#move-button')
const $btn_log = document.querySelector('#log-button')
const $btn_log_close = document.querySelector('#log-button-close')
const $btn_scan_close = document.querySelector('#scan-button-close')
const $btn_confirm_close = document.querySelector('#confirm-button-close')
const $btn_get = document.querySelector('#get-button')
const $btn_get_close = document.querySelector('#get-button-close')
const $btn_get_confim = document.querySelector('#get-confirm')
const $btn_get_close_confirm = document.querySelector('#get-confirm-button-close')
const $btn_table_close = document.querySelector("#close-table")
var buf;


$btn3.onclick = function () {
    $btn3.style.display='none';
    $.ajax({
        type: "GET",
        url: "check_movements/",
        data: {
            'data': 'none'
        },
        cache: false,
        success: function (data) {
            console.log("Ответ с сервера:");
            console.log(data);
            $btn_table_close.style.display='block';
            var table = document.querySelector('#move-table'),
            tbody = table.getElementsByTagName("tbody")[0];
            // console.log(type(data));
            table.style.display='table';
            var counter=0;
            for (const [k, v] of Object.entries(data)) {
                console.log(data[k]);
                var index;
                for (index = 0; index < data[k].length; ++index) {
                    counter+=1;
                    console.log(data[k][index]);
                    var row = document.createElement("tr");
                    var cell1 = document.createElement("td");
                    var cell2 = document.createElement("td");
                    var cell3 = document.createElement("td");
                    var cell4 = document.createElement("td");
                    cell2.setAttribute('class','Out');
                    cell3.setAttribute('class','Inp')
                    cell1.innerHTML=k;
                    cell2.innerHTML=data[k][index][0];
                    cell3.innerHTML=data[k][index][1];
                    cell4.innerHTML=` <button style=" color: #fff;
                    background-color: #337ab7;
                    border-color: #337ab7;border-radius:4px;border: 1px solid" type="button" id="work-button-${counter}" class="work_button">взять в работу</button>`;
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    row.appendChild(cell3);
                    row.appendChild(cell4);
                    tbody.appendChild(row);
                }

              }
              $btn_table_close.onclick=function(){
                table.style.display='none';
                $btn3.style.display='block';
                $btn_table_close.style.display='none';
              }
              $('.work_button').click(function(){
                var id = $(this);
                console.log(id[0].id);
                
                btn =  document.querySelector(`#${id[0].id}`);
                
                var out = btn.parentNode.parentNode.querySelector(".Out").textContent;
                var inp = btn.parentNode.parentNode.querySelector(".Inp").textContent;
                console.log(out,'->',inp);
                table.style.display='none';
                $btn_table_close.style.display='none';
                $btn3.style.display='block';
                window.location.href=`/page_movements?out=${out}&inp=${inp}`;
            })
          
        }
    })
}
$btn_log.onclick = function () {
    document.getElementById("reader2").style.visibility = 'visible';
    document.getElementById("reader2").style.height = 'auto';
    document.getElementById("reader2").style.border = '1px';
    document.getElementById("log-button").style.display = 'none';


    const scanner = new Html5QrcodeScanner(
        "reader2", {
        fps: 20
    }
    );

    scanner.render(success, error);
    document.getElementById("log-button-close").style.display = 'block';
    $btn_log_close.onclick = function () {
        scanner.clear();
        document.getElementById("reader2").style.height = '0px';
        document.getElementById("reader2").style.border = '0px';
        document.getElementById('log-button-close').style.display = 'none';
        document.getElementById("log-button").style.display = 'block';
    }
    function success(result) {
        scanner.clear();
        document.getElementById("reader2").style.height = '0px';
        document.getElementById("reader2").style.border = '0px';
        document.getElementById('log-button-close').style.display = 'none';
        document.getElementById("log-button").style.display = 'block';
        console.log("Клиент, получение инфы:");
        console.log(result);
        $.ajax({
            type: "GET",
            url: "get_logs/",
            data: {
                'data': result
            },
            cache: false,
            success: function (data) {
                console.log("Ответ с сервера:");
                console.log(data.data)

                document.getElementById("result2").innerHTML =
                    `<pre id="pre_id2">${data.data}</pre>`;
            }
        })
    }
    function error(err) {
        console.log(err)
    }

}

////

$btn.onclick = function () {
    document.getElementById("reader").style.visibility = 'visible';
    document.getElementById("reader").style.height = 'auto';
    document.getElementById("reader").style.border = '1px';
    document.getElementById("scan-btn").style.display = 'none';


    const scanner = new Html5QrcodeScanner(
        "reader", {
        fps: 20
    }
    );

    scanner.render(success, error);
    document.getElementById("scan-button-close").style.display = 'block';
    $btn_scan_close.onclick = function () {
        scanner.clear();
        document.getElementById("reader").style.height = '0px';
        document.getElementById("reader").style.border = '0px';
        document.getElementById('scan-button-close').style.display = 'none';
        document.getElementById("scan-btn").style.display = 'block';
    }




    function success(result) {

        document.getElementById("reader").style.height = '0px';
        console.log("Клиент, первый скан:")
        document.getElementById('scan-button-close').style.display = 'none';
        console.log(result)
        scanner.clear();
        $.ajax({
            type: "GET",
            url: "get_bd/",
            data: {
                'data': result,
            },
            dataType: "text",
            cache: false,
            success: function (data) {
                if (data == '401') {
                    console.log("Клиент, первый скан: нет места")
                    document.getElementById("scan-btn").style.display = 'block';
                    document.getElementById("scan-btn-1").style.display = 'none';
                    document.getElementById('result').style.display = 'block'
                    document.getElementById("result").innerHTML =
                        `<pre id="pre_id">Нет свободной ячейки!.</pre>`;

                }
                if (data == '400') {
                    console.log("Клиент, первый скан: неверный QR")
                    document.getElementById("scan-btn").style.display = 'block';
                    document.getElementById("scan-btn-1").style.display = 'none';
                    document.getElementById('result').style.display = 'block'
                    document.getElementById("result").innerHTML =
                        `<pre id="pre_id">Неправильный QR код! Пожалуйста проверьте еще раз.</pre>`;

                }
                else {
                    document.getElementById("scan-btn").style.display = 'none';
                    document.getElementById("scan-btn-1").style.display = 'block';
                    console.log("Клиент, данные, полученные с сервера:");
                    console.log(data);
                    buf = JSON.parse(data)
                    console.log("Куда нести:")
                    console.log(buf.move_to_cell_number)
                    document.getElementById('result').style.display = 'block'
                    document.getElementById("result").innerHTML =
                        `<pre id="pre_id">ID просканированного товара: ${buf.id}, имя товара: ${buf.name}, категория товара: ${buf.category}, отнести в : ${buf.move_to_cell_number}</pre>`;
                    document.getElementById("reader").style.visibility = 'hidden'
                    document.getElementById("confirm-button-close").style.display = 'block'
                    $btn_confirm_close.onclick = function () {
                        scanner.clear();
                        document.getElementById('result').style.display = 'none';
                        document.getElementById("reader").style.height = '0px';
                        document.getElementById('scan-btn-1').style.display = 'none'
                        document.getElementById('scan-btn').style.display = 'block'
                        document.getElementById('confirm-button-close').style.display = 'none'

                    }

                }


            }
        })
    }

    function error(err) {
        console.log(err)
    }



}

$btn_1.onclick = function () {

    document.getElementById("reader").style.visibility = 'visible';
    document.getElementById("reader").style.height = 'auto';


    const scanner = new Html5QrcodeScanner(
        "reader", {
        fps: 20
    }
    );

    scanner.render(success, error);
    $btn_confirm_close.onclick = function () {
        scanner.clear();
        document.getElementById('result').style.display = 'none';
        document.getElementById("reader").style.height = '0px';
        document.getElementById('scan-btn-1').style.display = 'none'
        document.getElementById('scan-btn').style.display = 'block'
        document.getElementById('confirm-button-close').style.display = 'none'

    }

    function success(result) {

        document.getElementById("reader").style.height = '0px';
        console.log(result)
        scanner.clear();
        document.getElementById("scan-btn").style.display = 'block';
        document.getElementById("scan-btn-1").style.display = 'none';
        console.log("Скан 2:")
        console.log(buf.move_to_cell_number)


        if (buf.move_to_cell_number == result) {
            document.getElementById("result").innerHTML =
                `<pre id="pre_id">Перемещение в ячейку номер ${result} Успешно зафиксировано</pre>`;
            $.ajax({
                type: "GET",
                url: "confirm_the_transfer/",
                data: {
                    'flag': JSON.stringify(true),
                    'data': JSON.stringify(buf),
                },
                //dataType: "bool",
                cache: false,
                success: function (data) {
                    console.log(data);


                    document.getElementById("reader").style.visibility = 'hidden'

                }
            })
        }
        else {
            document.getElementById("result").innerHTML =
                `<pre id="pre_id">Вы переместили товар не в ту ячейку! переместите товар в ячейку номер ${buf.move_to_cell_number}</pre>`;
            document.getElementById("scan-btn").style.display = 'none';
            document.getElementById("scan-btn-1").style.display = 'block';
            $.ajax({
                type: "GET",
                url: "confirm_the_transfer/",
                data: {
                    'flag': JSON.stringify(false),
                },
                dataType: "bool",
                cache: false,
                success: function (data) {
                    console.log(data);
                    document.getElementById("scan-btn").style.display = 'none';

                    document.getElementById("reader").style.visibility = 'hidden'

                }
            })
        }

    }

    function error(err) {
        console.log(err)
    }
}



$btn_get.onclick = function () {
    document.getElementById("result3").style.display = 'none';
    document.getElementById("reader3").style.visibility = 'visible';
    document.getElementById("reader3").style.height = 'auto';
    document.getElementById("get-button").style.display = 'none';
    document.getElementById("get-button-close").style.display = 'block';
    const scanner = new Html5QrcodeScanner(
        "reader3", {
        fps: 20
    }
    );
    scanner.render(success, error);
    $btn_get_close_confirm.onclick = function () {
        scanner.clear()
        document.getElementById("reader3").style.height = '0px';
        document.getElementById("result3").style.display = 'none';
        document.getElementById('get-button').style.display = 'block';
        document.getElementById('get-confirm').style.display = 'none';
        document.getElementById('get-confirm-button-close').style.display = 'none';
        document.getElementById('get-button').style.display = 'block';
    }
    $btn_get_close.onclick = function () {
        scanner.clear();
        document.getElementById("reader3").style.height = '0px';
        document.getElementById('get-button-close').style.display = 'none'
        document.getElementById('get-button').style.display = 'block'
    }
    function success(result) {
        scanner.clear();
        document.getElementById("reader3").style.height = '0px';
        document.getElementById('get-button-close').style.display = 'none'
        document.getElementById('get-button').style.display = 'none'
        document.getElementById('get-confirm').style.display = 'block'
        document.getElementById('get-confirm-button-close').style.display = 'block'
        console.log("Получение товара, 1 скан:")
        console.log(result)
        $.ajax({
            type: "GET",
            url: "get_item/",
            data: {
                'data': result
            },
            cache: false,
            success: function (data) {
                console.log(data.data);
                if (data.data == null) {
                    document.getElementById("result3").style.display = 'block';
                    document.getElementById("result3").innerHTML =
                        `<pre id="pre_id3">Товара нет на складе!</pre>`;
                }
                else {
                    document.getElementById("result3").style.display = 'block';
                    document.getElementById("result3").innerHTML =
                        `<pre id="pre_id3">Товар находится в ячейке ${data.data}</pre>`;
                }
            }
        })
    }
    function error(err) {
        console.log(err)
    }
}



$btn_get_confim.onclick = function () {
    document.getElementById("reader3").style.visibility = 'visible';
    document.getElementById("reader3").style.height = '250px';
    const scanner = new Html5QrcodeScanner(
        "reader3", {
        fps: 20
    }
    );
    scanner.render(success, error);
    $btn_get_close_confirm.onclick = function () {
        scanner.clear()
        document.getElementById("reader3").style.height = '0px';
        document.getElementById("result3").style.display = 'none';
        document.getElementById('get-confirm').style.display = 'none';
        document.getElementById('get-confirm-button-close').style.display = 'none';
        document.getElementById('get-button').style.display = 'block';
    }
    function success(result) {
        scanner.clear()
        document.getElementById("reader3").style.height = '0px';
        console.log("Получение товара: подтверждение");
        console.log(result)
        $.ajax({
            type: "GET",
            url: "get_item_confirm/",
            data: {
                'data': result
            },
            cache: false,
            success: function (data) {
                console.log(data)
                if (data == 200) {
                    document.getElementById("result3").style.display = 'block';
                    document.getElementById("result3").innerHTML =
                        `<pre id="pre_id3">Товар успешно извлечен!</pre>`;
                }
                if (data == 400) {
                    document.getElementById("result3").style.display = 'block';
                    document.getElementById("result3").innerHTML =
                        `<pre id="pre_id3">Ошибка при получении! Просканирована не та ячейка</pre>`;
                }
            }
        })

    }
    function error(err) {
        console.log(err)
    }
}
