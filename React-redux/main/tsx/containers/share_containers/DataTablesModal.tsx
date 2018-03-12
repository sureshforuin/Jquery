import * as React from 'react';
import DataTables from './DataTables';

class DataTablesModal extends React.Component<any, any> {
    
        componentDidMount() {
            this.showModal();
        }
    
        componentDidUpdate() {
            this.showModal();
        }
    
        render() {
            const { table, title } = this.props;
            return (
                <div className="modal fade" id="dataTablesModal" data-tabindex="-1" role="dialog" aria-labelledby="dataTablesModalLabel">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="myModalLabel">{title}</h4>
                            </div>
                            <div className="modal-body">
                                <DataTables data={table} />
                            </div>
                            <div className="modal-footer"></div>
                        </div>
                    </div>
                </div>
            );
        }
    
        showModal() {
            ($('#dataTablesModal') as any).modal('show');
        }
    
    }

    export default DataTablesModal;