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
                                    
                                   //browser is either chrome of mozilla
                                    //call export2excel.extract_html
                                    export2excel.extract_html.call(this);
                                    
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
                                //specifications for excel
                                var unknown="<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>"+
                                            "<x:Name>Table0</x:Name><x:WorksheetOptions><x:DisplayGridlines/>"+
                                            "</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->";
                                //get the table by id
                                var table=document.getElementById(this.table_id);
                                //get the th elements in thead
                                var th=table.getElementsByTagName('thead')[0].getElementsByTagName('th');
                                //extract the the html for the specified tag from the object
                                this.table_html=export2excel.extract_tag.call(th,'th');
                                //get the element by the table id and get all the tbody tags in it.
                                var tbody=table.getElementsByTagName('tbody');
                                var row;
                                //iterate over all tbody elements
                                for (var tb_counter=0; tb_counter<tbody.length; tb_counter++)
                                {
                                    //get all tr tags inside the current tbody
                                    var tr=tbody[tb_counter].getElementsByTagName('tr');
                                    for (var tr_counter=0; tr_counter<tr.length; tr_counter++)
                                    {
                                            var td=tr[tr_counter].getElementsByTagName('td');
                                            //call the extract_td function to get all the td values
                                            row=export2excel.extract_tag.call(td,'td');
                                            //concatenate the string
                                            this.table_html=this.table_html+row;    
                                    }
                                    
                                }
                                //final html to be saved                                
                                this.table_html="<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel'"+ 
                                                    " <head>"+unknown+
                                                    "</head><body><table>"+
                                                        this.table_html+'</table></body></html>';

                        }                           
export2excel.extract_tag=function(tag)
                        {
                            var holder="<tr>";
                            for (var td_counter=0; td_counter<this.length; td_counter++ )
                            {
                                //get the innertext of the td currently iterating over
                                holder=holder+'<'+tag+'>'+this[td_counter].innerHTML+'</'+tag+'>';
                            }
                            holder=holder+'</tr>';
                            //return the string containing the html for the specifed tag
                            return holder;

                        };