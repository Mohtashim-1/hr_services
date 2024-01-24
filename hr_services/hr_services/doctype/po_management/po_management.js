// Copyright (c) 2023, Elite Resources and contributors
// For license information, please see license.txt

frappe.ui.form.on('PO Management', {
	setup(frm) {
		frm.set_query("employee_no", function(){
		    return {
		        filters: [
		            ["Employee","project","in", "PROJ-0001"]
		        ]
		    }
		});
	},
	po_units(frm) {
		if(frm.doc.po_amount && frm.doc.po_units){
			calculate(frm);
		}
		if(frm.doc.used_units){
			if(frm.doc.po_units >= frm.doc.used_units){
				frm.set_value("remaining_units", frm.doc.po_units - frm.doc.used_units );
			}
			else{
				frappe.msgprint({
					title: __('Error'),
					indicator: 'red',
					message: __('Used Units must be less then or equals to PO Units')
				});
			}
		}
		else{
			frm.set_value("remaining_units", frm.doc.po_units );
		}

		if(frm.doc.remaining_units == 0){
			frm.set_value("status", "Completed");
		}
	},
	used_units(frm) {
		if(frm.doc.po_units >= frm.doc.used_units){
			frm.set_value("remaining_units", frm.doc.po_units - frm.doc.used_units );
		}
		else{
			frappe.msgprint({
				title: __('Error'),
				indicator: 'red',
				message: __('Used Units must be less then or equals to PO Units')
			});
		}

		if(frm.doc.remaining_units == 0){
			frm.set_value("status", "Completed");
		}
	},
	po_amount(frm) {
		if(frm.doc.po_amount && frm.doc.po_units){
			calculate(frm);
		}
	}
});

function calculate(frm){
	//inv_rate for invoicing rate, amount_wm for PO Amount without Margin, margin for Margin 8%, emp_rate for Employee Rate
	let inv_rate = 0;
	let amount_wm = 0;
	let margin = 0;
	let emp_rate = 0;
	inv_rate = frm.doc.po_amount / frm.doc.po_units;
	amount_wm = frm.doc.po_amount / 1.08;
	margin = amount_wm * 0.08;
	emp_rate = amount_wm / frm.doc.po_units
	frm.set_value("invoicing_rate",inv_rate);
	frm.set_value("margin",margin);
	frm.set_value("po_amount_wm",amount_wm);
	if(frm.doc.employment_type == "Part-time"){
		frm.set_value("employee_rate",emp_rate);
	}
	else{
		frm.set_value("employee_rate", 0);
	}
};
