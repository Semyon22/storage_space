const $verify_cell_button = document.querySelector('#verify-out-cell-button');
const $verify_inp_cell_button=document.querySelector("#verify-inp-cell-button");
const $close_reader_btn = document.querySelector("#close-reader");

$verify_cell_button.onclick = function () {

    document.getElementById("reader").style.visibility = 'visible';
    document.getElementById("reader").style.height = 'auto';
    $verify_cell_button.style.display='none';
    $close_reader_btn.style.display='block';
    const scanner = new Html5QrcodeScanner(
        "reader", {
        fps: 20
    }
    );

    scanner.render(success, error);
    $close_reader_btn.onclick = function () {
        $verify_cell_button.style.display='block';
        document.getElementById("reader").style.height = '0px';
        document.getElementById("reader").style.visibility = 'hidden';
        $close_reader_btn.style.display='none';
        scanner.clear();
    }
    function success(result) {
        console.log(result);
        document.getElementById("reader").style.height = '0px';
        document.getElementById("reader").style.visibility = 'hidden';
        $close_reader_btn.style.display='none';
        scanner.clear();

        var out = document.querySelector("#out").textContent;
        console.log(out);
        console.log(result);
        if (out == result){
            //верефицировали ячейку out
            document.getElementById("auth_result").innerHTML =
           `<pre id="pre_id" style="background-color:#a6ffb5;opacity: .8;border: 1px solid transparent;border-radius: .25rem;">Ячейка номер ${out} успешно верифицирована</pre>`;
                 $.ajax({
                type: "GET",
                url: "get_cell_data/",
                data: {
                    'data': result
                },
                //dataType: "bool",
                cache: false,
                success: function (data) {
                    //отрисовали таблицу элементов
                    table = document.querySelector("#items-move-table");
                    console.log(table)
                    tbody = table.getElementsByTagName("tbody")[0];
                    
                    table.style.display='table';
                    var counter = 0;
                    data.forEach(element => {
                        counter+=1
                        console.log(element);
                        console.log("------");
                        var row = document.createElement("tr");
                        var cell1 = document.createElement("td");
                        var cell2 = document.createElement("td");
                        var cell3 = document.createElement("td");
                        cell1.innerHTML = counter;
                        cell2.innerHTML=element;
                        cell3.innerHTML=` <button style=" color: #fff;
                        background-color: #337ab7;
                        border-color: #337ab7;border-radius:4px;border: 1px solid" type="button" id="work-button-${counter}" class="verify_button_item">Верефицировать</button>`;
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        row.appendChild(cell3);
                        tbody.appendChild(row);
                    });
                    //обработка кнопок в таблице
                    $('.verify_button_item').click(function(){
                       //скрываем таблицу
                        table.style.display='none';
                        $close_reader_btn.style.display='block';
                        $close_reader_btn.onclick = function () {
                            table.style.display='table';
                            document.getElementById("reader").style.height = '0px';
                            document.getElementById("reader").style.visibility = 'hidden';
                            $close_reader_btn.style.display='none';
                            scanner.clear();
                        }
                        var id = $(this);
                        console.log(id[0].id);
                        
                        id_item = document.querySelector(`#${id[0].id}`).parentNode.parentNode.querySelectorAll("td")[1].textContent;
                        number_item = document.querySelector(`#${id[0].id}`).parentNode.parentNode.querySelectorAll("td")[0].textContent;
                        document.getElementById("reader").style.visibility = 'visible';
                        document.getElementById("reader").style.height = 'auto';
                        
                        scanner.render(success, error);
                       
                        function success(result) {
                            if (result == id_item){
                                counter=counter - 1;
                                document.getElementById("reader").style.height = '0px';
                                document.getElementById("reader").style.visibility = 'hidden';
                                $close_reader_btn.style.display='none';
                                document.getElementById("auth_result").innerHTML =
                                `<pre id="pre_id"  style="background-color:#a6ffb5;opacity: .8;border: 1px solid transparent;border-radius: .25rem;">Товар номер ${number_item} успешно верифицирован</pre>`;
                                scanner.clear();
                               
                                //todo:Сделать так чтобы за место кнопки появлялась галочка
                                document.querySelector(`#${id[0].id}`).parentNode.innerHTML="Верифицировано";
                                table.style.display='table';
                                console.log(counter);
                                if (counter == 0){
                                    document.getElementById("auth_result").innerHTML =
                                    `<pre id="pre_id"  style="background-color:#a6ffb5;opacity: .8;border: 1px solid transparent;border-radius: .25rem;">Все товары успешно верифицированы</pre>`;
                                    $verify_inp_cell_button.style.display='block';
                                    //кнопка верификации inp ячейки
                                    $verify_inp_cell_button.onclick = function (){
                                        document.getElementById("reader").style.visibility = 'visible';
                                        document.getElementById("reader").style.height = 'auto';
                                        $verify_inp_cell_button.style.display='none';
                                        $close_reader_btn.style.display='block';
                                        $close_reader_btn.onclick = function () {
                                            
                                            document.getElementById("reader").style.height = '0px';
                                            document.getElementById("reader").style.visibility = 'hidden';
                                            $close_reader_btn.style.display='none';
                                            scanner.clear();
                                            $verify_inp_cell_button.style.display='block';
                                        }
                                        scanner.render(success, error);
                                        function success(result){
                                            var inp = document.querySelector("#inp").textContent;
                                            //прячем и очищаем сканер
                                            document.getElementById("reader").style.visibility = 'hidden';
                                            document.getElementById("reader").style.height = '0px';
                                            scanner.clear();
                                            $verify_inp_cell_button.style.display='none';
                                            if (result == inp) {
                                                
                                                $.ajax({
                                                    type: "GET",
                                                    url: `move_items/`,
                                                    data: {
                                                        'data': {out:out,inp:inp,} 
                                                    },
                                                    cache: false,
                                                    success: function (data) {
                                                        console.log(data);
                                                        $close_reader_btn.style.display='none';
                                                        if (data == 200){
                                                            document.getElementById("auth_result").innerHTML =
                                                            `<pre id="pre_id"  style="background-color:#a6ffb5;opacity: .8;border: 1px solid transparent;border-radius: .25rem;">Вы будете перенаправлены на главную через 5 секунд</pre>`;
                                                            document.getElementById("auth_item_msg").innerHTML =
                                                            `<pre id="pre_id" style="background-color:#a6ffb5;opacity: .8;border: 1px solid transparent;border-radius: .25rem;">Товары успешно перенесены.Спасибо за работу!</pre>`;
                                                            //отправляем обратно на страницу
                                                            setTimeout(function () {
                                                                window.location.href = "/"; 
                                                            }, 5000); 
                                                        }
                                                        else{
                                                            document.getElementById("auth_item_msg").innerHTML =
                                                            `<pre id="pre_id"  style="color:#f2ebed;background-color:#de4b6e;opacity: .8;border: 1px solid transparent;border-radius: .25rem;">Перемещение не зафиксировано.Возможна ошибка на стороне сервера!</pre>`;
                                                            setTimeout(function () {
                                                                window.location.href = "/"; 
                                                            }, 5000); 
                                                        }
                                                        
                                                        
                                                    }
                                                })
                                            }
                                        }
                                        function error(err){
                                            // document.getElementById("reader").style.visibility = 'hidden';
                                            // document.getElementById("reader").style.height = '0px';
                                            console.log(err);
                                        }
                                    }

                                }
                            }
                            else{
                                document.getElementById("reader").style.height = '0px';
                                document.getElementById("reader").style.visibility = 'hidden';
                                document.getElementById("auth_result").innerHTML =
                                `<pre id="pre_id"  style="color:#f2ebed;background-color:#de4b6e;opacity: .8;border: 1px solid transparent;border-radius: .25rem;">Товар номер ${number_item} не прошёл верификацию</pre>`;
                                scanner.clear();
                                table.style.display='table';
                                $close_reader_btn.style.display='none';
                            }
                        };
                        function error(err) {
                           
                        }
                      
                    })

               
                }
            })

        }
        //если не та входная ячейка
        else{
            $verify_cell_button.style.display='block';
            document.getElementById("auth_result").innerHTML =
           `<pre id="pre_id" style="color:#f2ebed;background-color:#de4b6e;opacity: .8;border: 1px solid transparent;border-radius: .25rem;">Ячейка номер ${result} не прошла верификацию.</pre>`;
        }
       }
   
    function error(err) {
        console.log(err)
    }
}