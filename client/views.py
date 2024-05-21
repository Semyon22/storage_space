from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators import gzip
from django.http import StreamingHttpResponse

from StockAPI import *



from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
def index(request):
    return render(request,"index.html")


def bd_get(request):
   
   data=request.GET.__getitem__('data')
   print("Сервер,данные первого скана:")
   #print(data)
   new_data=data.split('.')
   print(new_data)
   
   stk = Stock(dbname='postgres', user='postgres', password='12345', host='217.71.129.139', port='4385')
   try:
        id=stk.find_add_cell(new_data[0],new_data[1],new_data[2])
        if(id == None):
            return HttpResponse(401)
        else:
            print("Сервер, переместить в ячейку:")
            print(id)
            response={'id':new_data[0],'name':new_data[1],'category':new_data[2],'move_to_cell_number':id}
            json.dumps(response)
            print("Python,response:")
            print(response)
            return JsonResponse(response)
   except IndexError as e:
         print("Просканирован неправильный QR")
         return HttpResponse(400)




def confirm_transfer(request):
    """
    
    """
    flag=request.GET.__getitem__('flag')
    print("Флаг:")
    print(flag)
    data=request.GET.__getitem__('data')
    data_=json.loads(data)
    print("Данные:")
    print(data_)
    print(data_["move_to_cell_number"])
    print(data_["id"])
    print(data_["name"])
    print(data_["category"])
    user="admin"
    if(flag=="true"):
        print("Транзакция успешно подтверждена")
        stk = Stock(dbname='postgres', user='postgres', password='12345', host='217.71.129.139', port='4385')
        print(stk.add(data_["move_to_cell_number"],data_["id"],data_["name"],data_["category"],'admin'))
        
    else:
        print("Номера ячеек не совпадают!")

    return HttpResponse(200)


def get_logs(request):
    data=request.GET.__getitem__('data')
    new_data=data.split('.')
   
    stk = Stock(dbname='postgres', user='postgres', password='12345', host='217.71.129.139', port='4385')
    print("Сервер, инфа:")
    print(new_data)
    info=stk.get_info(new_data[0])
    print(info)
    response={'data':info}
    print(response)
    
    return JsonResponse(response)

def get_item(request):
    print("test")
    data=request.GET.__getitem__('data')
    print("Получение товара, инфа со сканера")
    print(data)
    new_data=data.split('.')
    stk = Stock(dbname='postgres', user='postgres', password='12345', host='217.71.129.139', port='4385')
    cell_id=stk.find_get_cell(new_data[0])
    print("Ячейка с товаром:")
    print(cell_id)
    response={'data':cell_id}
    return JsonResponse(response)

def get_item_confirm(request):
    data=request.GET.__getitem__('data')
    print("Подтверждение получения")
    print(data)
    stk = Stock(dbname='postgres', user='postgres', password='12345', host='217.71.129.139', port='4385')
    item_id=stk.get_info(data)
    print(item_id)
    item=stk.get_items_in_cell(data)
    print(item)
    try:
        flag=stk.get(data,item[0],'admin')
        if(flag==True):
            return HttpResponse(200)
    except IndexError as e:
         print("Просканирован неправильный QR")
         return HttpResponse(400)

def check_movements(request):
    #пока что допускаем что get_movements вернула такой результат
    # TEST_LIST={
    #     'meds':[[1,2],[3,5],[4,6]],
    #     'Computers':[[3,4],[43,25]]
    # }
    stk = Stock(dbname='postgres', user='postgres', password='12345', host='217.71.129.139', port='4385')
    response=stk.get_movements()
    print(response)
    return JsonResponse(response)

def page_movements(request):
  
    out = request.GET.get("out")
    inp = request.GET.get("inp")
    dict_out_inp={'out':out,'inp':inp}
    return render(request, "movements.html", context=dict_out_inp)

def get_cell_data(request):
    """
    url для вывода на страницу всех товаров из ячейки
    """
    print(request.GET.__getitem__('data'))
    stk = Stock(dbname='postgres', user='postgres', password='12345', host='217.71.129.139', port='4385')
    print(stk.get_items_in_cell(request.GET.__getitem__('data')))
    responce = stk.get_items_in_cell(request.GET.__getitem__('data'))
    # responce=['0915']
    return JsonResponse(responce,safe=False)

def move_items(request):
    stk = Stock(dbname='postgres', user='postgres', password='12345', host='217.71.129.139', port='4385')
    #прилетает первая ячейка out вторая Inp
    # print(request.GET.__getitem__("data"))
    print(request.GET.items())
    id_out=''
    id_inp=''
    counter = 0
    #костыль но что поделать
    for i in request.GET.items():
        if counter == 0:
            id_out = i[1]
        if counter ==1:
            id_inp=i[1]
        counter+=1
    
   
    #получаем данные о товарах в ячейке про помощи id_out
    items_in_cell_out=stk.get_items_in_cell(id_out)
    for item in items_in_cell_out:
        stk.move(id_inp,item,'admin_semyon')
    return HttpResponse(200)