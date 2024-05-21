const $verify_cell_button = document.querySelector('#verify-out-cell-button')
const $verify_inp_cell_button=document.querySelector("#verify-inp-cell-button");
$verify_cell_button.onclick = function () {

    document.getElementById("reader").style.visibility = 'visible';
    document.getElementById("reader").style.height = '250px';
    $verify_cell_button.style.display='none';

    const scanner = new Html5QrcodeScanner(
        "reader", {
        fps: 20
    }
    );

    scanner.render(success, error);
    function success(result) {
        console.log(result);
        document.getElementById("reader").style.height = '0px';
        document.getElementById("reader").style.visibility = 'hidden';
        
        scanner.clear();

        var out = document.querySelector("#out").textContent;
        console.log(out);
        console.log(result);
        if (out == result){
            document.getElementById("auth_result").innerHTML =
           `<pre id="pre_id">Ячейка номер ${out} успешно верифицирована</pre>`;
                 $.ajax({
                type: "GET",
                url: "get_cell_data/",
                data: {
                    'data': result
                },
                //dataType: "bool",
                cache: false,
                success: function (data) {
                    table = document.querySelector("#items-move-table");
                    console.log(table)
                    tbody = table.getElementsByTagName("tbody")[0];
                    
                    table.style.display='block';
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
                        cell3.innerHTML=` <button type="button" id="work-button-${counter}" class="verify_button_item">Верификация</button>`
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        row.appendChild(cell3);
                        tbody.appendChild(row);
                    });

                    $('.verify_button_item').click(function(){
                       //скрываем таблицу
                        table.style.display='none';
                        var id = $(this);
                        console.log(id[0].id);
                        
                        id_item = document.querySelector(`#${id[0].id}`).parentNode.parentNode.querySelectorAll("td")[1].textContent;
                        number_item = document.querySelector(`#${id[0].id}`).parentNode.parentNode.querySelectorAll("td")[0].textContent;
                        document.getElementById("reader").style.visibility = 'visible';
                        document.getElementById("reader").style.height = '250px';
                        
                        scanner.render(success, error);
                       
                        function success(result) {
                            if (result == id_item){
                                counter=counter - 1;
                                document.getElementById("reader").style.height = '0px';
                                document.getElementById("reader").style.visibility = 'hidden';
                                document.getElementById("auth_result").innerHTML =
                                `<pre id="pre_id">Товар номер ${number_item} успешно верифицирован</pre>`;
                                scanner.clear();
                               
                                //todo:Сделать так чтобы за место кнопки появлялась галочка
                                document.querySelector(`#${id[0].id}`).parentNode.innerHTML="Верифицировано";
                                table.style.display='block';
                                console.log(counter);
                                if (counter == 0){
                                    document.getElementById("auth_item_msg").innerHTML =
                                    `<pre id="pre_id">Все товары успешно верифицированы</pre>`;
                                    $verify_inp_cell_button.style.display='block';
                                    //кнопка верификации inp ячейки
                                    $verify_inp_cell_button.onclick = function (){
                                        document.getElementById("reader").style.visibility = 'visible';
                                        document.getElementById("reader").style.height = '250px';
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
                                                        console.log('заебок');
                                                        // if (data == true){
                                                        //     document.getElementById("auth_item_msg").innerHTML =
                                                        //     `<pre id="pre_id">Товары успешно перенесены.Спасибо за работу!</pre>`;
                                                        // }
                                                        // else{
                                                        //     document.getElementById("auth_item_msg").innerHTML =
                                                        //     `<pre id="pre_id">Перемещение не зафиксировано.Возможна ошибка на стороне сервера!</pre>`;
                                                        // }
                                                        
                                                        
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
                                `<pre id="pre_id">Товар номер ${number_item} не прошёл верификацию</pre>`;
                                scanner.clear();
                                table.style.display='block';
                            }
                        };
                        function error(err) {
                           
                        }
                      
                    })

               
                }
            })

        }
        else{
            document.getElementById("auth_result").innerHTML =
           `<pre id="pre_id">Ячейка номер ${result} не прошла верификацию. Проверьте номер ячейки</pre>`;
        }
       }
   
    function error(err) {
        console.log(err)
    }
}