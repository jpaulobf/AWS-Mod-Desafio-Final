var fncSubmitForm = function()
{
    var id_produto = $("#id_produto").val();
    var nm_produto = $("#nm_produto").val();
    var vl_produto = $("#vl_produto").val();

    if (id_produto === "" || nm_produto === "" || vl_produto === "")
    {
        alert("Todos os campos são obrigatórios");
        return;
    } else {
        const obj = {"id": id_produto, "nome": nm_produto, "preco": vl_produto};
        const myJSON = JSON.stringify(obj);

        $.ajax({
            url: entryPoint + '/items',
            type: 'PUT',
            crossDomain: true,
            contentType: 'application/json',
            dataType: "json",
            data: myJSON, 
            success: function(){
                $('#myForm').trigger("reset");
                alert('Item incluído/alterado com sucesso');
                fncLoadData();
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('Um erro aconteceu... código: ' + jqXHR.status);
            }
        });
    }
}

var fncEdit = function(id, name, value)
{
    $("#id_produto").val(id);
    $("#nm_produto").val(name);
    $("#vl_produto").val(value);
}

var fncLoadData = function()
{
    $.ajax({
        url: entryPoint + '/items',
        type: 'GET'
    }).done(function( array ) {
        var html = "";

        if (array.length > 0) {
            html +='<table class="grid">'
                    +'<thead>' +'<tr>' +'<th>Id</th>' +'<th>Produto</th>' + '<th>Preço</th>' + '<th>&nbsp;</th>' + '</tr>' +'</thead>'
                    +'<tbody>';

            for (var i = (array.length - 1); i >= 0; i--) {
                html +='<tr>'
                        +'<td class="grid-col"><a class="edit" onclick="fncEdit(\'' + array[i].id.S + '\', \'' + array[i].nome.S + '\', \'' + array[i].preco.N + '\')">' + array[i].id.S + '</a></td>'
                        +'<td class="grid-col">' + array[i].nome.S + '</td>'
                        +'<td class="grid-col">' + array[i].preco.N + '</td>'
                        +'<td class="grid-col"><a class="delete" onclick="fncDelete(' + array[i].id.S + ')">X</a></td>'
                        +'</tr>';
            }

            html +='</tbody></table>';
            $("#grid").html(html);
        } else {
            $("#grid").html("");
        }
    });
}

var fncDelete = function(id)
{
    if (confirm("Deseja realmente Excluir?") == true) {
        $.ajax({
            url: entryPoint + '/items/' + id,
            type: 'DELETE'
        }).done(function(  ) {
            $('#myForm').trigger("reset");
            alert('Item excluído com sucesso');
            fncLoadData();
        });
    } 
}