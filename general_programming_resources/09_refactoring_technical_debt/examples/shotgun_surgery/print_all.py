from header import render_header
from pdf_export import export_summary_pdf
from email_summary import build_email_subject
from settings_page import current_event_label

if __name__ == "__main__":
    print(render_header())
    print(export_summary_pdf(1515, 42))
    print(build_email_subject(1515))
    print(f"Settings page shows: {current_event_label()}")
