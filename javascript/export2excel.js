var export2excel= function(id,file_name)
                {
                    this.table_id=id;
                    this.file_name=file_name;
                    this.table_html='';
                }
export2excel.prototype.export=function()
                            {
                                function removelink(e)
                                {
                                    document.body.removeChild(e.target);
                                }
                                
                                //create a link
                                var link=document.createElement('a');
                                link.style.display='none';
                                if (link.download!==undefined)
                                {
                                    
                                    //call export2excel.extract_html
                                    export2excel.extract_html.call(this);
                                    //browser is either chrome of mozilla
                                    this.table_html="data:text/html,"+this.table_html;
                                    link.href=this.table_html;
                                    link.download=this.file_name;
                                    //remove link after it has been clicked
                                    link.onclick=removelink;
                                    //apend child to the body
                                    document.body.appendChild(link);
                                    //click the link
                                    link.click();

                                }
                                else
                                {
                                    //browser is internet explorer
                                    //safari is bad, very bad
                                    export2excel.extract_html.call(this);
                                    //create a new blob
                                    var blob=new Blob([this.table_html],{type:'text/plain'});
                                    //use the msSaveBlob method available only in ie
                                    window.navigator.msSaveBlob(blob, this.file_name);

                                }
                                
                            };
//below this are all static methods
export2excel.extract_html=function()
                        {
                                //get the elemetn by the table id and get all the tbody tags in it.
                                var tbody=document.getElementById(this.table_id).getElementsByTagName('tbody');
                                var row;
                                //iterate over all tbody elements
                                for (var tb_counter=0; tb_counter<tbody.length; tb_counter++)
                                {
                                    //get all td tags inside the current tbody
                                    var tr=tbody[tb_counter].getElementsByTagName('tr');
                                    for (var tr_counter=0; tr_counter<tr.length; tr_counter++)
                                    {
                                            var td=tr[tr_counter].getElementsByTagName('td');
                                            //call the extract_td function to get all the td values
                                            row=export2excel.extract_td.call(td);
                                            //push the returned array field table_data
                                            this.table_html=this.table_html+row;    
                                    }
                                    
                                }
                                
                                this.table_html="<table style='border:1px solid black'>"+
                                                        this.table_html+'</table>';

                                console.log(this.table_html);
                        }                           
export2excel.extract_td=function()
                        {
                            var holder="<tr style='border:1px solid black'>";
                            for (var td_counter=0; td_counter<this.length; td_counter++ )
                            {
                                //get the innertext of the td currently iterating over
                                holder=holder+'<td>'+this[td_counter].innerHTML+'</td>';
                            }
                            holder=holder+'</tr>';
                            //
                            //console.log(holder,'holder in extract');
                            //return an array containing the innertext of td
                            return holder;

                        };