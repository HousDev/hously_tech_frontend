import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Filter,
  X,
  Eye,
  Download,
  Mail,
  Trash2,
  Edit,
  MoreVertical,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  File,
  Image as ImageIcon,
  Tag,
  ChevronDown,
  AlertCircle,
  User,
  Building,
  Upload,
  Save,
  ArrowLeft,
  FileSignature,
  FileCheck,
  FileX,
  FolderOpen,
  Undo,
  Redo,
  Printer,
  Code
} from 'lucide-react';

import { documentApi } from '../../../lib/documentApi';
import { employeeApi } from '../../../lib/employeeApi';
import { uploadFile } from '../../../lib/api';
import { masterDataAPI } from '../../../lib/masterApi';
import toast, { Toaster } from 'react-hot-toast';

const offerLetterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Offer Letter Template</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        -webkit-print-color-adjust: exact;
      }
      .a4-page {
        width: 210mm !important;
        height: 277mm !important;
        margin: 0 !important;
        padding: 15mm 15mm !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        box-sizing: border-box;
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">

  <div class="a4-page" style="background-color: #ffffff; width: 210mm; height: 297mm; max-width: 100%; font-family: 'Inter', sans-serif; color: #334155; line-height: 1.8; font-size: 13px; position: relative; overflow: hidden; padding: 25mm 20mm; box-sizing: border-box; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 8px; display: flex; flex-direction: column; justify-content: flex-start;">
    
    <div style="position: absolute; top: 0; right: 0; width: 250px; height: 96px; overflow: hidden; pointer-events: none; z-index: 0;">
      <svg style="width: 100%; height: 100%;" viewBox="0 0 300 100" preserveAspectRatio="none">
        <path d="M120 0C180 32 240 12 300 48V0H120Z" fill="#FCD603" />
        <path d="M145 0C200 22 252 8 300 32V0H145Z" fill="#0076D8" />
      </svg>
    </div>

    <div style="position: relative; z-index: 10; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      
      <div>
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
          <div style="display: flex; align-items: center;">
            <div style="width: 52px; height: 52px; background-color: #0076D8; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 800; font-size: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
              H
            </div>
          </div>

          <div style="text-align: right; font-size: 10px; color: #0f172a; line-height: 1.6; padding-right: 24px;">
            <p style="margin: 0; font-weight: 700; color: #0f172a;">{{ phone }} <span style="font-size: 12px; margin-left: 2px;">📞</span></p>
            <p style="margin: 2px 0 0 0; font-weight: 700; color: #0f172a;">{{ email }} <span style="font-size: 12px; margin-left: 2px;">✉️</span></p>
            <p style="margin: 2px 0 0 0; font-weight: 600; color: #1e293b;">{{ address }} <span style="font-size: 12px; margin-left: 2px;">📍</span></p>
          </div>
        </div>

        <div style="height: 6px; width: 100%; display: flex; align-items: center; margin-bottom: 25px;">
          <div style="width: 18%; height: 100%; background-color: #FCD603; clip-path: polygon(0 0, 85% 0, 100% 100%, 0 100%);"></div>
          <div style="flex-grow: 1; height: 100%; background-color: #0076D8; clip-path: polygon(2% 0, 100% 0, 100% 100%, 0 100%); margin-left: 4px;"></div>
        </div>

        <div style="margin-bottom: 20px; font-size: 13px; color: #334155; line-height: 1.6;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #0f172a;">To,</p>
          <p style="margin: 0; font-weight: bold; color: #0f172a;">{{ employee_name }}</p>
          <p style="margin: 0; color: #475569;">{{ employee_address }}</p>
        </div>

        <div style="margin-bottom: 20px; font-weight: 800; color: #0f172a; font-size: 13.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
          Subject: Offer of Employment for {{ designation }}
        </div>

        <p style="font-weight: bold; margin: 0 0 14px 0; color: #0f172a;">Dear {{ employee_name }},</p>

        <p style="margin: 0 0 14px 0; text-align: justify;">
          We are pleased to offer you the position of {{ designation }} at {{ company_name }}.
        </p>

        <p style="margin: 0 0 14px 0; text-align: justify;">
          Your employment will commence from {{ joining_date }}, and you will be based at {{ work_location }}.
        </p>

        <p style="margin: 0 0 14px 0; text-align: justify;">
          Your annual Cost to Company (CTC) will be {{ salary }}.
        </p>

        <p style="margin: 0 0 14px 0; text-align: justify;">
          You will be on probation for a period of {{ probation_period }}.
        </p>

        <p style="margin: 0 0 14px 0; text-align: justify;">
          We believe your skills, enthusiasm, and dedication will make you a great asset to our growing team. At {{ company_name }}, we encourage innovation, teamwork, and continuous learning, and we look forward to achieving new milestones together.
        </p>

        <p style="margin: 0 0 20px 0; text-align: justify;">
          Please sign and return the duplicate copy of this letter as a token of your acceptance of this offer and confirm your joining details.
        </p>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: end; font-size: 11px; color: #475569; padding-top: 10px; border-top: 1px solid #f1f5f9; position: relative; z-index: 10;">
          <div>
            <p style="font-weight: bold; color: #0f172a; margin: 0 0 8px 0;">Best Regards,</p>
            
            <p style="font-weight: bold; color: #0f172a; margin: 15px 0 0 0;">{{ hr_name }}</p>
            <p style="font-size: 9.5px; color: #64748b; margin: 2px 0 0 0; font-weight: 500;">{{ hr_designation }}</p>
            <p style="font-size: 9.5px; color: #0076D8; margin: 2px 0 0 0; font-weight: bold;">{{ company_name }}</p>
          </div>
          
          <div style="text-align: right;">
            <div style="border-bottom: 1px solid #e2e8f0; width: 120px; height: 35px; margin-bottom: 6px; display: flex; align-items: end; justify-content: flex-end;">
            </div>
            <p style="font-size: 9.5px; font-weight: bold; color: #64748b; margin: 0;">Candidate Signature</p>
          </div>
        </div>

        <div style="height: 6px; width: 100%; display: flex; align-items: center; margin-top: 15px;">
          <div style="flex-grow: 1; height: 100%; background-color: #0076D8; clip-path: polygon(0 0, 98% 0, 100% 100%, 0 100%);"></div>
          <div style="width: 18%; height: 100%; background-color: #FCD603; clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%); margin-left: 4px;"></div>
        </div>
      </div>
    </div>

    <div style="position: absolute; bottom: 0; right: 0; width: 130px; height: 130px; opacity: 0.05; pointer-events: none; z-index: 0;">
      <svg style="width: 100%; height: 100%; color: #b45309;" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="85" cy="85" r="15" />
        <circle cx="85" cy="85" r="28" />
        <circle cx="85" cy="85" r="41" />
        <circle cx="85" cy="85" r="54" />
        <circle cx="85" cy="85" r="67" />
        <circle cx="85" cy="85" r="80" />
      </svg>
    </div>

  </div>

</body>
</html>`;

const paySlipHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Salary Slip Template</title>
  <style>
    @media print {
      body {
        margin: 0;
        padding: 0;
        background: #ffffff;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">

  <div style="background-color: #ffffff; width: 100%; height: auto; min-height: 840px; font-family: 'Inter', sans-serif; color: #334155; line-height: 1.5; font-size: 10px; position: relative; overflow: hidden; padding: 40px; box-sizing: border-box; aspect-ratio: 1/1.41;">
    
    <div style="text-align: center; border-bottom: 2px solid #0076D8; padding-bottom: 12px; margin-bottom: 16px;">
      <h1 style="font-size: 16px; font-weight: 800; color: #0076D8; text-transform: uppercase; margin: 0;">
        Hously Finntech Realty
      </h1>
      <p style="font-size: 8px; color: #64748b; margin: 2px 0 0 0;">First Floor, Tamara Uprise Rahatani, Pune | www.hously.in</p>
      <h2 style="font-size: 11px; font-weight: bold; color: #334155; text-transform: uppercase; margin: 8px 0 0 0; background-color: #f8fafc; padding: 4px; border-radius: 4px; display: inline-block;">
        Salary Slip for the month of June 2026
      </h2>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background-color: #fafafb; border: 1px solid #f1f5f9; padding: 12px; border-radius: 8px;">
      <div style="display: grid; grid-template-columns: 80px 1fr; gap: 4px;">
        <span style="color: #64748b; font-weight: 500;">Employee Name:</span>
        <strong style="color: #1e293b;">{{ employee_name }}</strong>
        
        <span style="color: #64748b; font-weight: 500;">Employee ID:</span>
        <span style="color: #334155; font-weight: 600;">EMP0017</span>
        
        <span style="color: #64748b; font-weight: 500;">Department:</span>
        <span style="color: #334155; font-weight: 600;">{{ department }}</span>
      </div>

      <div style="display: grid; grid-template-columns: 80px 1fr; gap: 4px;">
        <span style="color: #64748b; font-weight: 500;">Bank Name:</span>
        <span style="color: #334155; font-weight: 600;">HDFC Bank Ltd</span>
        
        <span style="color: #64748b; font-weight: 500;">Account No:</span>
        <span style="color: #334155; font-weight: 600;">XXXXXXXX9876</span>
        
        <span style="color: #64748b; font-weight: 500;">PF Number:</span>
        <span style="color: #334155; font-weight: 600;">MH/BAN/0082761/000</span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
      
      <div style="border-right: 1px solid #e2e8f0;">
        <div style="background-color: #0076D8; color: #ffffff; padding: 6px 10px; font-weight: bold; text-transform: uppercase; font-size: 9px;">
          Earnings
        </div>
        <div style="padding: 8px 10px; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9;">
          <span>Basic Salary</span>
          <strong style="color: #1e293b;">₹45,000.00</strong>
        </div>
        <div style="padding: 8px 10px; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9;">
          <span>House Rent Allowance (HRA)</span>
          <strong style="color: #1e293b;">₹18,000.00</strong>
        </div>
        <div style="padding: 8px 10px; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9;">
          <span>Medical Allowance</span>
          <strong style="color: #1e293b;">₹3,000.00</strong>
        </div>
        <div style="padding: 8px 10px; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9;">
          <span>Special Allowance</span>
          <strong style="color: #1e293b;">₹14,000.00</strong>
        </div>
        <div style="padding: 10px; display: flex; justify-content: space-between; background-color: #f8fafc; font-weight: bold; border-top: 1px solid #e2e8f0;">
          <span>Gross Earnings</span>
          <span style="color: #0076D8;">₹80,000.00</span>
        </div>
      </div>

      <div>
        <div style="background-color: #0076D8; color: #ffffff; padding: 6px 10px; font-weight: bold; text-transform: uppercase; font-size: 9px;">
          Deductions
        </div>
        <div style="padding: 8px 10px; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9;">
          <span>Provident Fund (PF)</span>
          <strong style="color: #1e293b;">₹5,400.00</strong>
        </div>
        <div style="padding: 8px 10px; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9;">
          <span>Professional Tax (PT)</span>
          <strong style="color: #1e293b;">₹200.00</strong>
        </div>
        <div style="padding: 8px 10px; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9;">
          <span>Income Tax (TDS)</span>
          <strong style="color: #1e293b;">₹4,400.00</strong>
        </div>
        <div style="padding: 8px 10px; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9;">
          <span>Loss of Pay (LOP)</span>
          <strong style="color: #1e293b;">₹0.00</strong>
        </div>
        <div style="padding: 10px; display: flex; justify-content: space-between; background-color: #f8fafc; font-weight: bold; border-top: 1px solid #e2e8f0;">
          <span>Total Deductions</span>
          <span style="color: #ef4444;">₹10,000.00</span>
        </div>
      </div>

    </div>

    <div style="background-color: #0076D8; border-radius: 8px; color: #ffffff; padding: 12px 16px; margin-bottom: 30px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 8px; margin-bottom: 8px;">
        <span style="font-weight: 500; font-size: 11px;">Gross Salary</span>
        <span style="font-size: 11px; font-weight: 600;">₹80,000.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 8px; margin-bottom: 8px;">
        <span style="font-weight: 500; font-size: 11px;">Deductions</span>
        <span style="font-size: 11px; font-weight: 600;">- ₹10,000.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 13px;">
        <span>Net Salary (Take-home)</span>
        <span style="background-color: #ffffff; color: #0076D8; padding: 2px 10px; border-radius: 4px; font-weight: 800;">₹70,000.00</span>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: end; font-size: 9px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 16px;">
      <div>
        <p style="margin: 0; font-weight: 600; color: #475569;">Prepared By: Admin Operations</p>
        <p style="margin: 2px 0 0 0; color: #94a3b8;">Hously Finntech Realty</p>
      </div>
      <div style="text-align: right;">
        <div style="border-bottom: 1px solid #cbd5e1; width: 100px; height: 25px; margin-bottom: 4px;"></div>
        <p style="margin: 0; font-weight: 600; color: #475569;">Director Signature</p>
      </div>
    </div>

  </div>

</body>
</html>`;

const contractHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Employment Contract Template</title>
  <style>
    @media print {
      body {
        margin: 0;
        padding: 0;
        background: #ffffff;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">

  <div style="background-color: #ffffff; width: 100%; height: auto; min-height: 840px; font-family: 'Inter', sans-serif; color: #334155; line-height: 1.6; font-size: 10px; position: relative; overflow: hidden; padding: 40px; box-sizing: border-box; aspect-ratio: 1/1.41;">
    
    <div style="text-align: center; border-bottom: 2px solid #334155; padding-bottom: 12px; margin-bottom: 20px;">
      <h1 style="font-size: 16px; font-weight: 800; color: #1e293b; text-transform: uppercase; margin: 0; letter-spacing: 0.5px;">
        Employment Contract
      </h1>
      <p style="font-size: 8px; color: #94a3b8; margin: 2px 0 0 0; text-transform: uppercase; font-weight: 600; tracking-widest: 1px;">Strictly Confidential & Proprietary</p>
    </div>

    <div style="margin-bottom: 16px; font-size: 10px; color: #475569;">
      <p style="margin: 0 0 10px 0;">
        This Employment Contract (the "Agreement") is entered into on this day by and between <strong>Hously Finntech Realty</strong> (hereinafter referred to as the "Company") and <strong>{{ employee_name }}</strong> (hereinafter referred to as the "Employee").
      </p>
    </div>

    <div style="margin-bottom: 20px; font-size: 9.5px; color: #334155;">
      
      <div style="margin-bottom: 12px; border-left: 2px solid #334155; padding-left: 8px;">
        <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 10px; color: #0f172a;">1. Position & Duties</h3>
        <p style="margin: 0;">The Employee shall occupy the position of <strong>{{ job_title }}</strong> and shall report to the Operations Director. Responsibilities include standard developer operations, system auditing, and general CRM updates.</p>
      </div>

      <div style="margin-bottom: 12px; border-left: 2px solid #334155; padding-left: 8px;">
        <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 10px; color: #0f172a;">2. Term & Start Date</h3>
        <p style="margin: 0;">Employment shall commence on <strong>{{ start_date }}</strong> and continue as an indefinite full-time placement, subject to a probationary review period of 3 months.</p>
      </div>

      <div style="margin-bottom: 12px; border-left: 2px solid #334155; padding-left: 8px;">
        <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 10px; color: #0f172a;">3. Compensation (CTC)</h3>
        <p style="margin: 0;">The Company agrees to pay the Employee a monthly gross salary of <strong>{{ salary }}</strong>, subject to regular statutory audits, provident fund accruals, and TDS withholdings.</p>
      </div>

      <div style="margin-bottom: 12px; border-left: 2px solid #334155; padding-left: 8px;">
        <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 10px; color: #0f172a;">4. Confidentiality</h3>
        <p style="margin: 0;">The Employee agrees to hold all proprietary trade secrets, software assets, database schemas, and client details in strict confidentiality during and after employment.</p>
      </div>

    </div>

    <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
      <p style="font-size: 9px; color: #64748b; margin-bottom: 16px;">IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.</p>
      
      <div style="display: flex; justify-content: space-between; font-size: 10px; color: #475569;">
        <div>
          <div style="border-bottom: 1px solid #cbd5e1; width: 120px; height: 35px; margin-bottom: 4px;"></div>
          <p style="font-weight: bold; color: #0f172a; margin: 0;">Authorized Director</p>
          <p style="font-size: 8px; color: #94a3b8; margin: 2px 0 0 0;">Hously Finntech Realty</p>
        </div>

        <div style="text-align: right;">
          <div style="border-bottom: 1px solid #cbd5e1; width: 120px; height: 35px; margin-bottom: 4px;"></div>
          <p style="font-weight: bold; color: #0f172a; margin: 0;">{{ employee_name }}</p>
          <p style="font-size: 8px; color: #94a3b8; margin: 2px 0 0 0;">Candidate Signature</p>
        </div>
      </div>
    </div>

  </div>

</body>
</html>`;

const agreementHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NDA Agreement Template</title>
  <style>
    @media print {
      body {
        margin: 0;
        padding: 0;
        background: #ffffff;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">

  <div style="background-color: #ffffff; width: 100%; height: auto; min-height: 840px; font-family: 'Inter', sans-serif; color: #334155; line-height: 1.6; font-size: 10px; position: relative; overflow: hidden; padding: 40px; box-sizing: border-box; aspect-ratio: 1/1.41;">
    
    <div style="text-align: center; border-bottom: 2px solid #0076D8; padding-bottom: 12px; margin-bottom: 20px;">
      <h1 style="font-size: 16px; font-weight: 800; color: #0076D8; text-transform: uppercase; margin: 0; letter-spacing: 0.5px;">
        Mutual NDA Agreement
      </h1>
      <p style="font-size: 8px; color: #64748b; margin: 2px 0 0 0; text-transform: uppercase; font-weight: 600;">Non-Disclosure & Confidentiality Protocol</p>
    </div>

    <div style="margin-bottom: 16px; font-size: 10px; color: #475569;">
      <p style="margin: 0 0 10px 0;">
        This Mutual Non-Disclosure Agreement (the "Agreement") is effective as of <strong>{{ effective_date }}</strong> by and between <strong>Hously Finntech Realty</strong> and <strong>{{ employee_name }}</strong>.
      </p>
    </div>

    <div style="margin-bottom: 20px; font-size: 9.5px; color: #334155;">
      
      <div style="margin-bottom: 12px;">
        <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 10px; color: #0f172a;">1. Definition of Confidential Material</h3>
        <p style="margin: 0;">"Confidential Information" shall include all proprietary software products, source code repositories, client records, pricing models, and data logs disclosed between both parties during terms of operations.</p>
      </div>

      <div style="margin-bottom: 12px;">
        <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 10px; color: #0f172a;">2. Obligations of Non-Disclosure</h3>
        <p style="margin: 0;">Neither party shall disclose, reproduce, or distribute the other party's Confidential Information to any third party without obtaining prior written approval from the disclosing party.</p>
      </div>

      <div style="margin-bottom: 12px;">
        <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 10px; color: #0f172a;">3. Term & Survival</h3>
        <p style="margin: 0;">This agreement and obligations of confidentiality shall remain binding for a period of 5 years following the termination of operations between the parties.</p>
      </div>

    </div>

    <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 10px; color: #475569;">
        <div>
          <div style="border-bottom: 1px solid #cbd5e1; width: 120px; height: 35px; margin-bottom: 4px;"></div>
          <p style="font-weight: bold; color: #0f172a; margin: 0;">For Hously Finntech Realty</p>
          <p style="font-size: 8px; color: #94a3b8; margin: 2px 0 0 0;">Authorized Representative</p>
        </div>

        <div style="text-align: right;">
          <div style="border-bottom: 1px solid #cbd5e1; width: 120px; height: 35px; margin-bottom: 4px;"></div>
          <p style="font-weight: bold; color: #0f172a; margin: 0;">{{ employee_name }}</p>
          <p style="font-size: 8px; color: #94a3b8; margin: 2px 0 0 0;">Receiving Party Signature</p>
        </div>
      </div>
    </div>

  </div>

</body>
</html>`;

const blankTemplateHtml = `<div style="font-family: 'Inter', sans-serif; font-size: 13.5px; line-height: 1.65; color: #1e293b; padding: 30px;">
  <h2>New Document Template</h2>
  <p>Start editing this document, or switch to Source Code Editor view (&lt;&gt;) to paste your custom HTML code.</p>
</div>`;

// ─── TYPES & DATA ────────────────────────────────────────────────────────────

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  avatarUrl?: string;
  designationRole?: string;
  city?: string;
  state?: string;
  pincode?: string;
  salary?: number;
  salaryType?: string;
  joinDate?: string;
  dateOfLeaving?: string;
}

interface GeneratedDocument {
  id: string;
  name: string;
  type: string;
  status: 'Generated' | 'Draft' | 'Pending';
  format: string;
  date: string;
  employeeId: string;
}

interface DocumentTemplate {
  id: number;
  name: string;
  category: 'Offer Letter' | 'Pay Slip' | 'Contract' | 'Agreement' | 'Custom';
  variables: number;
  updated: string;
  status: 'Approved' | 'Pending Approval' | 'Rejected';
  content?: string;
  logoUrl?: string | null;
  sealUrl?: string | null;
  sigUrl?: string | null;
  sealX?: number;
  sealY?: number;
  sealWidth?: number;
  sigX?: number;
  sigY?: number;
  sigWidth?: number;
}

export const getFullImageUrl = (url: string | null) => {
  if (!url) return '';
  if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const base = apiBase.replace(/\/api$/, '');
  return `${base}${url}`;
};

export const getPercentX = (val: number | undefined | null, defaultValue: number) => {
  if (val === undefined || val === null) return defaultValue;
  if (val > 100) return Number(((val / 672) * 100).toFixed(2));
  return val;
};

export const getPercentY = (val: number | undefined | null, defaultValue: number) => {
  if (val === undefined || val === null) return defaultValue;
  if (val > 100) return Number(((val / 1000) * 100).toFixed(2));
  return val;
};

export const getPercentWidth = (val: number | undefined | null, defaultValue: number) => {
  if (val === undefined || val === null) return defaultValue;
  if (val > 100) return Number(((val / 672) * 100).toFixed(2));
  return val;
};

// Static seed data removed — templates and documents are now loaded from the database API

export const renderTemplateContent = (htmlString: string, logo: string | null, _seal: string | null, _sig: string | null) => {
  let html = htmlString || '';
  if (logo) {
    const logoPath = getFullImageUrl(logo);
    // Matches fallback logo div container OR previously replaced logo image tag (with class or specific dimensions/styles)
    const logoRegex = /<div style="[^"]*background-color:\s*(?:#0076d8|#0076D8|rgb\(\s*0,\s*118,\s*216\s*\))[^"]*">\s*H\s*<\/div>|<img[^>]*class="template-logo-img"[^>]*>|<img[^>]*style="[^"]*height:\s*(?:52px|40px)[^"]*object-fit:\s*contain[^"]*"[^>]*>/gi;
    html = html.replace(logoRegex, (match) => {
      const isLarge = match.toLowerCase().includes('52px');
      const size = isLarge ? '52px' : '40px';
      return `<img class="template-logo-img" src="${logoPath}" style="height: ${size}; width: auto; object-fit: contain;" />`;
    });
  }

  // Always strip old dashed placeholders if they exist
  const sealFallback = /<div style="[^"]*border:\s*1px\s*dashed\s*#cbd5e1[^"]*">\s*Seal\s*<\/div>/gi;
  html = html.replace(sealFallback, '');

  const sigFallback = /<div style="[^"]*border:\s*1px\s*dashed\s*#cbd5e1[^"]*">\s*Signature\s*<\/div>/gi;
  html = html.replace(sigFallback, '');

  return html;
};


interface EmployeeData {
  name?: string;
  department?: string;
  jobTitle?: string;
  salary?: string;
  joinDate?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email?: string;
  employeeId?: string;
  dateOfLeaving?: string;
}

const getRenderedHtml = (type: string, empData: EmployeeData, templatesList: DocumentTemplate[] = []) => {
  let html = '';
  const customTpl = templatesList.find(t => t.name === type || t.category === type);
  if (customTpl && customTpl.content) {
    let rawContent = customTpl.content;
    if (!rawContent.toLowerCase().includes('class="a4-page"') && !rawContent.toLowerCase().includes("class='a4-page'")) {
      // Wrap in standard A4 document wrapper so layout and overlays render identically to template editor
      rawContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${customTpl.name}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        -webkit-print-color-adjust: exact;
      }
      .a4-page {
        width: 210mm !important;
        height: 297mm !important;
        margin: 0 !important;
        padding: 25mm 20mm !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        box-sizing: border-box;
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">
  <div class="a4-page" style="background-color: #ffffff; width: 210mm; height: 297mm; max-width: 100%; font-family: 'Inter', sans-serif; color: #334155; line-height: 1.8; font-size: 13px; position: relative; overflow: hidden; padding: 25mm 20mm; box-sizing: border-box; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 8px; display: flex; flex-direction: column; justify-content: flex-start;">
    ${rawContent}
  </div>
</body>
</html>`;
    }
    html = rawContent;
  } else {
    if (type === 'Offer Letter') html = offerLetterHtml;
    else if (type === 'Pay Slip') html = paySlipHtml;
    else if (type === 'Contract') html = contractHtml;
    else if (type === 'Agreement') html = agreementHtml;
    else html = blankTemplateHtml;
  }

  if (!html) return '';

  // Build dynamic address from city/state/pincode
  const parts = [empData.city, empData.state, empData.pincode].filter(Boolean);
  const dynamicAddress = parts.length > 0 ? parts.join(', ') : 'Rahatani, Pune, Maharashtra - 411017';

  // Format salary
  const salaryDisplay = empData.salary
    ? `₹${Number(empData.salary).toLocaleString('en-IN')}.00`
    : '₹80,000.00';

  // Format joining date
  const joinDateDisplay = empData.joinDate
    ? new Date(empData.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : (empData.joinDate || 'June 25, 2026');

  // Format leaving date
  const leavingDateDisplay = empData.dateOfLeaving
    ? new Date(empData.dateOfLeaving).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  // Format current date (Today)
  const currentDateDisplay = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const defaults: Record<string, string> = {
    employee_name: empData.name || 'Employee Name',
    employee_address: dynamicAddress,
    designation: empData.jobTitle || (empData.department === 'HR' ? 'HR Recruiter' : empData.department === 'STORE' ? 'Store Assistant' : 'Finance Manager'),
    job_title: empData.jobTitle || (empData.department === 'HR' ? 'HR Recruiter' : empData.department === 'STORE' ? 'Store Assistant' : 'Finance Manager'),
    department: empData.department || 'Operations',
    joining_date: joinDateDisplay,
    start_date: joinDateDisplay,
    work_location: 'Main Office, Pune',
    salary: salaryDisplay,
    probation_period: '3 Months',
    hr_name: 'Maria Aguado',
    hr_designation: 'HRD Hously Finntech Realty',
    company_name: 'Hously Finntech Realty',
    website: 'www.hously.in',
    phone: '+91 9371 00 9381',
    email: 'careers@hously.in',
    address: 'First Floor, Tamara Uprise Rahatani, Pune',
    hiring_manager: 'Maria Aguado',
    hiring_manager_title: 'HRD Hously Finntech Realty',
    date: empData.joinDate || 'June 10, 2026',
    effective_date: empData.joinDate || 'June 10, 2026',
    employee_id: empData.employeeId || 'EMP001',
    month_year: empData.joinDate ? new Date(empData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'June 2026',
    issue_date: currentDateDisplay,
    date_of_leaving: leavingDateDisplay,
    ctc: empData.salary ? `₹${(Number(empData.salary) * 12).toLocaleString('en-IN')}.00 Per Annum` : '₹9,60,000.00 Per Annum'
  };

  // Format acceptance date for offer letter (8 days after join date)
  const parsedDate = empData.joinDate ? new Date(empData.joinDate) : new Date();
  const acceptanceDate = isNaN(parsedDate.getTime())
    ? "June 18, 2026"
    : new Date(new Date(parsedDate).setDate(parsedDate.getDate() + 8)).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

  const allVars = { ...defaults, acceptance_date: acceptanceDate };

  Object.entries(allVars).forEach(([key, val]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(regex, val);
  });

  if (customTpl) {
    html = renderTemplateContent(html, customTpl.logoUrl || null, null, null);

    let overlays = '';
    if (customTpl.sealUrl) {
      const sealX = getPercentX(customTpl.sealX, 15);
      const sealY = getPercentY(customTpl.sealY, 75);
      const sealW = getPercentWidth(customTpl.sealWidth, 10);
      overlays += `
        <div style="position: absolute; left: ${sealX}%; top: ${sealY}%; z-index: 50; mix-blend-mode: multiply; pointer-events: none; width: ${sealW}%;">
          <img src="${getFullImageUrl(customTpl.sealUrl)}" style="width: 100%; height: auto; object-fit: contain;" />
        </div>
      `;
    }
    if (customTpl.sigUrl) {
      const sigX = getPercentX(customTpl.sigX, 50);
      const sigY = getPercentY(customTpl.sigY, 75);
      const sigW = getPercentWidth(customTpl.sigWidth, 15);
      overlays += `
        <div style="position: absolute; left: ${sigX}%; top: ${sigY}%; z-index: 50; mix-blend-mode: multiply; pointer-events: none; width: ${sigW}%;">
          <img src="${getFullImageUrl(customTpl.sigUrl)}" style="width: 100%; height: auto; object-fit: contain;" />
        </div>
      `;
    }
    if (overlays) {
      const bodyCloseIndex = html.toLowerCase().lastIndexOf('</body>');
      if (bodyCloseIndex !== -1) {
        const preBodyHtml = html.substring(0, bodyCloseIndex);
        const lastDivIndex = preBodyHtml.lastIndexOf('</div>');
        if (lastDivIndex !== -1) {
          html = preBodyHtml.substring(0, lastDivIndex) + overlays + preBodyHtml.substring(lastDivIndex) + html.substring(bodyCloseIndex);
        } else {
          html = preBodyHtml + overlays + html.substring(bodyCloseIndex);
        }
      } else {
        const lastDivIndex = html.lastIndexOf('</div>');
        if (lastDivIndex !== -1) {
          html = html.substring(0, lastDivIndex) + overlays + html.substring(lastDivIndex);
        } else {
          html = html + overlays;
        }
      }
    }
  }

  return html;
};

// ─── MAIN CONTAINER ──────────────────────────────────────────────────────────

export default function HRMSDocuments() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle?: (title: string) => void;
    setHeaderSubtitle?: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle) setHeaderTitle("Document Hub");
    if (setHeaderSubtitle) setHeaderSubtitle("Manage corporate templates, generate certificates, and track official forms");
  }, [setHeaderTitle, setHeaderSubtitle]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'templates'>('dashboard');
  const [templateViewState, setTemplateViewState] = useState<'list' | 'create' | 'edit'>('list');

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      if (activeTab === 'templates' && templateViewState !== 'list') {
        setHeaderTitle("");
        setHeaderSubtitle("");
      } else {
        setHeaderTitle("Document Hub");
        setHeaderSubtitle("Manage corporate templates, generate certificates, and track official forms");
      }
    }
  }, [setHeaderTitle, setHeaderSubtitle, activeTab, templateViewState]);

  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);

  const fetchDocumentData = async () => {
    try {
      const [tList, dList] = await Promise.all([
        documentApi.getAllTemplates(),
        documentApi.getAllDocuments()
      ]);
      setTemplates(tList as any[]);
      setDocuments(dList as any[]);
    } catch (err: any) {
      console.error('Failed to load Document Hub data:', err);
    }
  };

  useEffect(() => {
    fetchDocumentData();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else {
      toast(message, {
        icon: 'ℹ️',
      });
    }
  };

  // Statistics calculation
  const stats = useMemo(() => {
    return [
      {
        label: 'Total Documents',
        value: documents.length,
        sub: 'Generated documents',
        icon: <FileText size={18} />,
        cardBg: 'bg-blue-50/40 border-blue-100/50 text-blue-900',
        iconBg: 'bg-blue-600 text-white shadow-sm'
      },
      {
        label: 'Active Templates',
        value: templates.filter(t => t.status === 'Approved').length,
        sub: 'Available templates',
        icon: <FileSignature size={18} />,
        cardBg: 'bg-purple-50/40 border-purple-100/50 text-purple-900',
        iconBg: 'bg-purple-600 text-white shadow-sm'
      },
      {
        label: 'Active Employees',
        value: documents.length,
        sub: 'Available for documents',
        icon: <Users size={18} />,
        cardBg: 'bg-emerald-50/40 border-emerald-100/50 text-emerald-900',
        iconBg: 'bg-emerald-600 text-white shadow-sm'
      },
      {
        label: 'Generated This Month',
        value: documents.filter(d => d.date.includes('-06-') || d.date.includes('-07-')).length,
        sub: 'New documents',
        icon: <Calendar size={18} />,
        cardBg: 'bg-amber-50/40 border-amber-100/50 text-amber-900',
        iconBg: 'bg-amber-600 text-white shadow-sm'
      }
    ];
  }, [documents, templates]);

  return (
    <div className={`md:h-[calc(100vh-64px)] h-auto flex flex-col font-sans overflow-y-auto md:overflow-hidden relative ${activeTab === 'templates' && templateViewState !== 'list' ? 'bg-white' : 'bg-slate-50'}`}>
      <Toaster position="top-right" />

      {/* Sticky Tabs & Stats Header (Sticky on desktop and large screens) */}
      {(activeTab === 'dashboard' || (activeTab === 'templates' && templateViewState === 'list')) && (
        <div className="flex-shrink-0 bg-slate-50 border-b border-slate-100/50 space-y-4 px-4 md:px-6 py-4">
          {/* Navigation Tabs (No Title / No Subtitle) */}
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex bg-slate-200/50 p-1 rounded-xl border border-slate-100/30">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-lg transition-all duration-300 cursor-pointer ${activeTab === 'dashboard'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <FileText size={14} />
                Document Dashboard
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-lg transition-all duration-300 cursor-pointer ${activeTab === 'templates'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <FileSignature size={14} />
                Document Templates
              </button>
            </div>
          </div>

          {/* Stats Row (Only on Dashboard tab) */}
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 animate-[fadeIn_0.15s_ease-out]">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border shadow-xs flex items-center justify-between hover:shadow-sm transition ${s.cardBg}`}
                >
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{s.label}</p>
                    <p className="text-xl font-extrabold mt-1">{s.value}</p>
                    <p className="text-[10px] opacity-70 mt-0.5">{s.sub}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${s.iconBg}`}>
                    {s.icon}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Content View (fills the remaining height cleanly down to the bottom) */}
      <div className={`md:flex-1 h-auto md:overflow-hidden overflow-visible pb-0 flex flex-col ${
        templateViewState === 'list' ? 'px-4 md:px-6' : 'px-0'
      }`}>
        {activeTab === 'dashboard' ? (
          <DocumentDashboard
            documents={documents}
            setDocuments={setDocuments}
            triggerToast={triggerToast}
            templates={templates}
          />
        ) : (
          <DocumentTemplates
            templates={templates}
            setTemplates={setTemplates}
            triggerToast={triggerToast}
            viewState={templateViewState}
            setViewState={setTemplateViewState}
          />
        )}
      </div>

      {/* Custom styled scrollbars & resets */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

// ─── DOCUMENT DASHBOARD ──────────────────────────────────────────────────────

interface DashboardProps {
  documents: GeneratedDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<GeneratedDocument[]>>;
  triggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  templates: DocumentTemplate[];
}

function DocumentDashboard({ documents, setDocuments, triggerToast, templates }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [viewDoc, setViewDoc] = useState<GeneratedDocument | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<GeneratedDocument | null>(null);

  const handleShareEmail = (doc: GeneratedDocument) => {
    if (sendingEmailId) return;
    setSendingEmailId(doc.id);

    const emp = employees.find(e => e.id === doc.employeeId);
    if (!emp || !emp.email) {
      triggerToast("Employee email address not found on record.", "error");
      setSendingEmailId(null);
      return;
    }

    const htmlContent = getRenderedHtml(
      doc.type,
      {
        name: emp?.name || '',
        department: emp?.department || '',
        jobTitle: emp?.designationRole || undefined,
        salary: emp?.salary !== undefined ? String(emp.salary) : undefined,
        joinDate: emp?.joinDate || doc.date,
        city: emp?.city || undefined,
        state: emp?.state || undefined,
        pincode: emp?.pincode || undefined,
        email: emp?.email || undefined,
        employeeId: emp?.id || undefined,
        dateOfLeaving: emp?.dateOfLeaving || undefined
      },
      templates
    );

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '0';
    iframe.style.top = '0';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.zIndex = '-99999';
    iframe.style.border = '0';
    iframe.style.opacity = '1';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
    }

    const fileName = `${doc.name.replace(/\s+/g, "_")}.pdf`;

    const waitForImages = (iframeBody: HTMLElement): Promise<void> => {
      const imgs = Array.from(iframeBody.querySelectorAll('img'));
      const promises = imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      });
      return Promise.all(promises).then(() => { });
    };

    const executeEmailSend = async () => {
      const iframeBody = iframe.contentWindow?.document.body;
      if (!iframeBody) {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
        setSendingEmailId(null);
        return;
      }

      iframeBody.style.margin = '0';
      iframeBody.style.padding = '0';
      iframeBody.style.overflow = 'hidden';
      iframeBody.style.height = '296.5mm';

      const targetElement = (iframeBody.querySelector('.a4-page') as HTMLElement) || iframeBody;
      if (targetElement !== iframeBody) {
        targetElement.style.margin = '0';
        targetElement.style.border = 'none';
        targetElement.style.boxShadow = 'none';
        targetElement.style.borderRadius = '0';
        targetElement.style.height = '296.5mm';
      }

      try {
        await waitForImages(iframeBody);

        const opt = {
          margin: 0,
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: 'avoid-all' }
        };

        triggerToast("Generating PDF and sending email...", "info");

        // @ts-ignore
        const pdfBase64 = await window.html2pdf().from(targetElement).set(opt).outputPdf('datauristring');

        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }

        const subject = `Official Document: ${doc.name}`;
        const body = `Dear ${emp.name || 'Employee'},\n\nPlease find your generated document "${doc.name}" attached below.\n\nBest Regards,\nHR Team\nHously Fintech Realty`;

        await documentApi.sendDocumentEmail({
          email: emp.email,
          subject,
          body,
          pdfBase64,
          filename: fileName
        });

        triggerToast(`Document sent successfully to ${emp.email}!`, "success");
      } catch (err: any) {
        console.error('PDF Generation or Email sending failed:', err);
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
        triggerToast(`Failed to send email.`, "error");
      } finally {
        setSendingEmailId(null);

      }
    };

    // Load html2pdf dynamically from CDN if not loaded
    // @ts-ignore
    if (window.html2pdf) {
      executeEmailSend();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = executeEmailSend;
      script.onerror = () => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
        setSendingEmailId(null);
        triggerToast('Failed to load PDF engine.', 'error');
      };
      document.body.appendChild(script);
    }
  };

  // Filters Drawer States
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [ignoreDate, setIgnoreDate] = useState(true);

  const [tempFilterEmployee, setTempFilterEmployee] = useState('');
  const [tempFilterDept, setTempFilterDept] = useState('');
  const [tempFilterType, setTempFilterType] = useState('');
  const [tempFilterDateFrom, setTempFilterDateFrom] = useState('');
  const [tempFilterDateTo, setTempFilterDateTo] = useState('');
  const [tempIgnoreDate, setTempIgnoreDate] = useState(true);

  useEffect(() => {
    if (isFilterOpen) {
      setTempFilterEmployee(filterEmployee);
      setTempFilterDept(filterDept);
      setTempFilterType(filterType);
      setTempFilterDateFrom(filterDateFrom);
      setTempFilterDateTo(filterDateTo);
      setTempIgnoreDate(ignoreDate);
    }
  }, [isFilterOpen, filterEmployee, filterDept, filterType, filterDateFrom, filterDateTo, ignoreDate]);

  // Generation Modal States
  const [genDocType, setGenDocType] = useState('Offer Letter');
  const [genSearchEmp, setGenSearchEmp] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const list = await employeeApi.getAll();
        const formatted: Employee[] = list.map(emp => {
          const fullName = [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(' ');
          return {
            id: emp.employeeId,
            name: fullName,
            email: emp.email,
            phone: emp.phone,
            department: emp.department || '',
            avatarUrl: emp.avatarUrl,
            designationRole: emp.designationRole || '',
            city: emp.city || '',
            state: emp.state || '',
            pincode: emp.pincode || '',
            salary: emp.salary,
            salaryType: emp.salaryType,
            joinDate: emp.joinDate || '',
            dateOfLeaving: emp.dateOfLeaving || ''
          };
        });
        setEmployees(formatted);
      } catch (err) {
        console.error('Failed to fetch real employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  // Active filter count
  const filterCount = useMemo(() => {
    let count = 0;
    if (filterEmployee) count++;
    if (filterDept) count++;
    if (filterType) count++;
    if (!ignoreDate && (filterDateFrom || filterDateTo)) count++;
    return count;
  }, [filterEmployee, filterDept, filterType, ignoreDate, filterDateFrom, filterDateTo]);

  const handleResetFilters = () => {
    setFilterEmployee('');
    setFilterDept('');
    setFilterType('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setIgnoreDate(true);

    setTempFilterEmployee('');
    setTempFilterDept('');
    setTempFilterType('');
    setTempFilterDateFrom('');
    setTempFilterDateTo('');
    setTempIgnoreDate(true);

    triggerToast("Filters cleared.", "info");
  };

  // Filter lists
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchingEmp = employees.find(emp => emp.id === doc.employeeId);
      const matchesFilterEmployee = filterEmployee
        ? matchingEmp?.name.toLowerCase().includes(filterEmployee.toLowerCase())
        : true;

      const matchesFilterDept = filterDept
        ? matchingEmp?.department.toLowerCase() === filterDept.toLowerCase()
        : true;

      const matchesFilterType = filterType
        ? doc.type === filterType
        : true;

      let matchesDate = true;
      if (!ignoreDate) {
        const docDate = new Date(doc.date);
        if (filterDateFrom) {
          const from = new Date(filterDateFrom);
          if (docDate < from) matchesDate = false;
        }
        if (filterDateTo) {
          const to = new Date(filterDateTo);
          to.setHours(23, 59, 59, 999);
          if (docDate > to) matchesDate = false;
        }
      }

      return matchesSearch && matchesFilterEmployee && matchesFilterDept && matchesFilterType && matchesDate;
    });
  }, [documents, employees, searchQuery, filterEmployee, filterDept, filterType, ignoreDate, filterDateFrom, filterDateTo]);

  const modalFilteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const q = genSearchEmp.toLowerCase();
      return emp.name.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q);
    });
  }, [employees, genSearchEmp]);

  const handleGenerate = async () => {
    if (!selectedEmp) {
      triggerToast("Select employee.", "error");
      return;
    }
    const docId = `DOC-${Date.now()}`;
    const newDoc: GeneratedDocument = {
      id: docId,
      name: `${genDocType} - ${selectedEmp.name}`,
      type: genDocType,
      status: 'Generated',
      format: 'PDF',
      date: new Date().toISOString().split('T')[0],
      employeeId: selectedEmp.id
    };
    try {
      await documentApi.createDocument(newDoc as any);
    } catch (err) {
      console.warn('Backend save failed, adding locally:', err);
    }
    setDocuments([newDoc, ...documents]);
    setIsGenerateOpen(false);
    setSelectedEmp(null);
    setGenSearchEmp('');
    triggerToast(`${newDoc.name} has been generated.`);
  };

  const handleDownload = (doc: GeneratedDocument) => {
    if (downloadingDocId) return;
    setDownloadingDocId(doc.id);

    const emp = employees.find(e => e.id === doc.employeeId);
    const htmlContent = getRenderedHtml(
      doc.type,
      {
        name: emp?.name || '',
        department: emp?.department || '',
        jobTitle: emp?.designationRole || undefined,
        salary: emp?.salary !== undefined ? String(emp.salary) : undefined,
        joinDate: emp?.joinDate || doc.date,
        city: emp?.city || undefined,
        state: emp?.state || undefined,
        pincode: emp?.pincode || undefined,
        email: emp?.email || undefined,
        employeeId: emp?.id || undefined,
        dateOfLeaving: emp?.dateOfLeaving || undefined
      },
      templates
    );

    // Create an isolated iframe to parse HTML safely (avoids nested html/body tag bugs in html2canvas)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '0';
    iframe.style.top = '0';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.zIndex = '-99999';
    iframe.style.border = '0';
    iframe.style.opacity = '1'; // Must be visible for html2canvas to capture it
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
    }

    const fileName = `${doc.name.replace(/\s+/g, "_")}.pdf`;

    const waitForImages = (iframeBody: HTMLElement): Promise<void> => {
      const imgs = Array.from(iframeBody.querySelectorAll('img'));
      const promises = imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      });
      return Promise.all(promises).then(() => { });
    };

    const executePdfDownload = async () => {
      const iframeBody = iframe.contentWindow?.document.body;
      if (!iframeBody) {
        document.body.removeChild(iframe);
        setDownloadingDocId(null);
        return;
      }

      // Hide overflow and margins on body
      iframeBody.style.margin = '0';
      iframeBody.style.padding = '0';
      iframeBody.style.overflow = 'hidden';
      iframeBody.style.height = '296.5mm';

      const targetElement = (iframeBody.querySelector('.a4-page') as HTMLElement) || iframeBody;
      if (targetElement !== iframeBody) {
        targetElement.style.margin = '0';
        targetElement.style.border = 'none';
        targetElement.style.boxShadow = 'none';
        targetElement.style.borderRadius = '0';
        targetElement.style.height = '296.5mm';
      }

      try {
        // Wait for logo, signature, and seal images to load completely
        await waitForImages(iframeBody);

        const opt = {
          margin: 0,
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: 'avoid-all' }
        };

        // @ts-ignore
        await window.html2pdf().from(targetElement).set(opt).save();

        document.body.removeChild(iframe);
        setDownloadingDocId(null);
        triggerToast(`${doc.name} download complete.`, "success");
      } catch (err: any) {
        console.error('PDF Generation failed:', err);
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
        setDownloadingDocId(null);
        triggerToast(`Failed to generate PDF.`, "error");
      }
    };

    // Load html2pdf dynamically from CDN if not loaded
    // @ts-ignore
    if (window.html2pdf) {
      executePdfDownload();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = executePdfDownload;
      script.onerror = () => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
        setDownloadingDocId(null);
        triggerToast('Failed to load PDF engine.', 'error');
      };
      document.body.appendChild(script);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDoc) return;
    try {
      await documentApi.deleteDocument(deleteDoc.id);
    } catch (err) {
      console.warn('Backend delete failed, removing locally:', err);
    }
    setDocuments(documents.filter(d => d.id !== deleteDoc.id));
    triggerToast("Document deleted successfully.", "success");
    setDeleteDoc(null);
  };

  return (
    /* Unified Layout block: the search bar and cards scroll occupy a single card container 
       which has no bottom gap and fills the screen, scrolling only the cards list. */
    <div className="bg-white rounded-t-2xl border-x border-t border-slate-100 flex flex-col md:flex-1 h-auto md:overflow-hidden overflow-visible shadow-xs">

      {/* 1. Header Toolbar (Search and Actions) */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white flex-shrink-0 z-10">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-gray-600 outline-none focus:border-blue-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Generate / Filter buttons */}
        <div className="flex items-center gap-3">
          {/* Sidefilter button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition cursor-pointer ${filterCount > 0
              ? 'bg-blue-50 border-blue-100 text-blue-700'
              : 'bg-white border-slate-200 text-gray-600 hover:bg-slate-50'
              }`}
          >
            <Filter size={13} />
            Filters
            {filterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] text-white font-bold">
                {filterCount}
              </span>
            )}
          </button>

          {/* Generate Document */}
          <button
            onClick={() => setIsGenerateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition  cursor-pointer"
          >
            <Plus size={14} /> Generate Document
          </button>
        </div>
      </div>

      {/* 2. Scrollable card container (Only this part scrolls inside the wrapper div) */}
      <div className="md:flex-1 h-auto md:overflow-y-auto overflow-visible p-4 bg-slate-50/20 scrollbar-thin">
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center">
            <FolderOpen size={36} className="text-gray-300 mb-2" />
            <p className="text-xs font-bold text-gray-600">No documents found</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Try clearing filters or checking your search.</p>
            {filterCount > 0 && (
              <button onClick={handleResetFilters} className="mt-3 text-[10px] font-bold text-blue-600 hover:underline">
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => {
              const matchingEmp = employees.find(emp => emp.id === doc.employeeId);
              return (
                <motion.div
                  key={doc.id}
                  layoutId={`doc-card-${doc.id}`}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col justify-between transition hover:shadow-md"
                >
                  {/* Card top half: A scrollable document preview (Optimized scaling to eliminate horizontal scrollbar) */}
                  <div className="bg-slate-50/50 rounded-xl p-2.5 h-36 overflow-y-auto overflow-x-hidden scrollbar-none mb-3 border border-slate-100/50 relative">
                    <div className="w-[170%] origin-top-left scale-[0.58] select-none pointer-events-none">
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{
                          __html: getRenderedHtml(
                            doc.type,
                            {
                              name: matchingEmp?.name || '',
                              department: matchingEmp?.department || '',
                              jobTitle: matchingEmp?.designationRole || undefined,
                              salary: matchingEmp?.salary !== undefined ? String(matchingEmp.salary) : undefined,
                              joinDate: matchingEmp?.joinDate || doc.date,
                              city: matchingEmp?.city || undefined,
                              state: matchingEmp?.state || undefined,
                              pincode: matchingEmp?.pincode || undefined,
                              email: matchingEmp?.email || undefined,
                              employeeId: matchingEmp?.id || undefined,
                              dateOfLeaving: matchingEmp?.dateOfLeaving || undefined
                            },
                            templates
                          )
                        }}
                      />
                    </div>
                  </div>

                  {/* Card middle half: Document title & details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-xl bg-blue-50/70 text-blue-600 flex-shrink-0`}>
                        <File size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs text-gray-800 truncate" title={doc.name}>
                            {doc.name}
                          </h4>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100/30 whitespace-nowrap">
                            active
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">{matchingEmp?.name}</p>
                      </div>
                    </div>

                    {/* Metadata Lists (Perfect side-by-side alignment matching layout) */}
                    <div className="text-[11px] text-gray-500 pt-2.5 border-t border-slate-50 space-y-1">
                      <div className="flex justify-between">
                        <div className="flex gap-4">
                          <span className="text-gray-400 w-12">Type</span>
                          <span className="font-bold text-gray-700">{doc.type}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-gray-400 w-12">Format</span>
                          <span className="font-bold text-gray-700">{doc.format}</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-gray-400 w-12">Generated</span>
                        <span className="font-medium text-gray-600">{doc.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom bar icons (eye, download, share, delete) - Align right, default colors */}
                  <div className="mt-3.5 pt-2 border-t border-slate-50 flex items-center justify-end gap-1">
                    <button
                      onClick={() => setViewDoc(doc)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>

                    {/* Email PDF Button */}
                    <button
                      onClick={() => handleShareEmail(doc)}
                      disabled={sendingEmailId === doc.id}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer disabled:opacity-50"
                      title="Email PDF to Employee"
                    >
                      {sendingEmailId === doc.id ? (
                        <svg className="animate-spin h-3.5 w-3.5 text-blue-500" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <Mail size={14} />
                      )}
                    </button>

                    <button
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingDocId === doc.id}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                      title="Download File"
                    >
                      {downloadingDocId === doc.id ? (
                        <svg className="animate-spin h-3.5 w-3.5 text-blue-500" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <Download size={14} />
                      )}
                    </button>

                    <button
                      onClick={() => setDeleteDoc(doc)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. POPUPS & OVERLAYS */}
      {/* A. View Popup Details */}
      <AnimatePresence>
        {viewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewDoc(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 border border-slate-100"
            >
              <div className="px-5 py-3.5 bg-gradient-to-r from-blue-700 to-blue-800 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText size={15} />
                  <span className="font-bold text-xs">{viewDoc.name}</span>
                </div>
                <button onClick={() => setViewDoc(null)} className="p-1 hover:bg-white/10 rounded transition text-white cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              <div className="p-5 bg-slate-50 flex-1 overflow-y-auto border-b border-slate-100">
                <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-inner">
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: (() => {
                        const emp = employees.find(e => e.id === viewDoc.employeeId);
                        return getRenderedHtml(
                          viewDoc.type,
                          {
                            name: emp?.name || '',
                            department: emp?.department || '',
                            jobTitle: emp?.designationRole || undefined,
                            salary: emp?.salary !== undefined ? String(emp.salary) : undefined,
                            joinDate: emp?.joinDate || viewDoc.date,
                            city: emp?.city || undefined,
                            state: emp?.state || undefined,
                            pincode: emp?.pincode || undefined,
                            email: emp?.email || undefined,
                            employeeId: emp?.id || undefined,
                            dateOfLeaving: emp?.dateOfLeaving || undefined
                          },
                          templates
                        );
                      })()
                    }}
                  />
                </div>
              </div>

              <div className="px-5 py-3 bg-white flex justify-end gap-3.5">
                <button
                  onClick={() => setViewDoc(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-gray-500 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const d = viewDoc;
                    setViewDoc(null);
                    handleDownload(d);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} /> Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. Generate Document Popup */}
      <AnimatePresence>
        {isGenerateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGenerateOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden z-10 border border-slate-100 flex flex-col max-h-[85vh]"
            >
              <div className="px-5 py-3.5 bg-gradient-to-r from-blue-700 to-blue-800 text-white flex justify-between items-center">
                <span className="font-bold text-xs">Generate Document</span>
                <button onClick={() => setIsGenerateOpen(false)} className="p-1 hover:bg-white/10 rounded transition text-white cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Document Type</label>
                  <div className="relative">
                    <select
                      value={genDocType}
                      onChange={(e) => setGenDocType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition appearance-none cursor-pointer"
                    >
                      <option value="Offer Letter">Offer Letter</option>
                      <option value="Pay Slip">Pay Slip</option>
                      <option value="Contract">Contract</option>
                      <option value="Agreement">Agreement</option>
                      {templates.map(t => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Employee</label>
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search name, department, ID, email..."
                      value={genSearchEmp}
                      onChange={(e) => setGenSearchEmp(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="border border-slate-100 rounded-xl divide-y divide-slate-50 max-h-40 overflow-y-auto bg-slate-50/50">
                    {modalFilteredEmployees.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-400">
                        {employees.length === 0 ? 'Loading employees...' : 'No employees match your search.'}
                      </div>
                    ) : modalFilteredEmployees.map((emp) => {
                      const isSelected = selectedEmp?.id === emp.id;
                      const initials = emp.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                      return (
                        <div
                          key={emp.id}
                          onClick={() => {
                            setSelectedEmp(emp);
                            setGenSearchEmp(emp.name);
                          }}
                          className={`p-2.5 cursor-pointer flex items-center gap-3 text-xs transition ${isSelected ? 'bg-blue-50/80 text-blue-800' : 'hover:bg-white bg-transparent text-slate-600'}`}
                        >
                          {/* Avatar */}
                          <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 border border-white shadow-sm">
                            {emp.avatarUrl ? (
                              <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                            ) : initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{emp.name}</p>
                            <p className="text-[9px] text-gray-400 mt-0.5 truncate">{emp.email} | {emp.id}</p>
                          </div>
                          <span className="text-[9px] font-bold bg-slate-100 px-2 py-0.5 rounded text-gray-500 flex-shrink-0">
                            {emp.department}
                          </span>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setIsGenerateOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-gray-50 bg-white rounded-xl text-xs font-bold text-gray-500 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Generate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* C. Delete Document Overlay */}
      <AnimatePresence>
        {deleteDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteDoc(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden z-10 border border-slate-100 p-5">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3"><AlertCircle size={20} /></div>
              <h3 className="text-sm font-extrabold text-gray-800">Delete Document</h3>
              <p className="text-xs text-gray-500 mt-1">Are you sure you want to permanently delete <strong>{deleteDoc.name}</strong>? This action is irreversible.</p>

              <div className="flex gap-3 mt-5">
                <button onClick={() => setDeleteDoc(null)} className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-gray-500 transition cursor-pointer">Cancel</button>
                <button onClick={handleDeleteConfirm} className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. Side Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="w-screen max-w-xs bg-white shadow-xl flex flex-col border-l border-slate-100"
              >
                <div className="px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white flex justify-between items-center">
                  <span className="font-bold text-xs">Filter Settings</span>
                  <button onClick={() => setIsFilterOpen(false)} className="p-1 hover:bg-white/10 rounded transition text-white cursor-pointer">
                    <X size={15} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Employee Name</label>
                    <input
                      type="text"
                      placeholder="Search employee..."
                      value={tempFilterEmployee}
                      onChange={(e) => setTempFilterEmployee(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Department</label>
                    <select
                      value={tempFilterDept}
                      onChange={(e) => setTempFilterDept(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                    >
                      <option value="">All Departments</option>
                      <option value="STORE">STORE</option>
                      <option value="EXECUTION">EXECUTION</option>
                      <option value="HR">HR</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Document Type</label>
                    <select
                      value={tempFilterType}
                      onChange={(e) => setTempFilterType(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                    >
                      <option value="">All Types</option>
                      <option value="Offer Letter">Offer Letter</option>
                      <option value="Pay Slip">Pay Slip</option>
                      <option value="Contract">Contract</option>
                      <option value="Agreement">Agreement</option>
                    </select>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Filter by Date</label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-blue-600 select-none">
                        <input
                          type="checkbox"
                          checked={tempIgnoreDate}
                          onChange={(e) => setTempIgnoreDate(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3 h-3"
                        />
                        Ignore date
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block mb-1">From Date</span>
                        <input
                          type="date"
                          disabled={tempIgnoreDate}
                          value={tempFilterDateFrom}
                          onChange={(e) => setTempFilterDateFrom(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none disabled:opacity-50 disabled:bg-slate-100"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block mb-1">To Date</span>
                        <input
                          type="date"
                          disabled={tempIgnoreDate}
                          value={tempFilterDateTo}
                          onChange={(e) => setTempFilterDateTo(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none disabled:opacity-50 disabled:bg-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => {
                      setFilterEmployee(tempFilterEmployee);
                      setFilterDept(tempFilterDept);
                      setFilterType(tempFilterType);
                      setFilterDateFrom(tempFilterDateFrom);
                      setFilterDateTo(tempFilterDateTo);
                      setIgnoreDate(tempIgnoreDate);
                      setIsFilterOpen(false);
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Apply Filter
                  </button>
                  <button onClick={handleResetFilters} className="w-full py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-gray-500 cursor-pointer">
                    Reset
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── DOCUMENT TEMPLATES ─────────────────────────────────────────────────────

interface TemplatesProps {
  templates: DocumentTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<DocumentTemplate[]>>;
  triggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  viewState: 'list' | 'create' | 'edit';
  setViewState: React.Dispatch<React.SetStateAction<'list' | 'create' | 'edit'>>;
}

function DocumentTemplates({ templates, setTemplates, triggerToast, viewState, setViewState }: TemplatesProps) {
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showSealOnPage, setShowSealOnPage] = useState(false);
  const [showSigOnPage, setShowSigOnPage] = useState(false);
  const [documentVariables, setDocumentVariables] = useState<any[]>([]);

  useEffect(() => {
    const fetchDocVariables = async () => {
      try {
        const types = await masterDataAPI.getAllMasterTypes("common");
        const docVarType = types.find((t: any) =>
          t.name?.toLowerCase().includes("document variable")
        );
        if (docVarType) {
          const vals = await masterDataAPI.getMasterValues(docVarType.id);
          const activeVals = vals.filter((v: any) => v.status === "Active" || v.status === "active");
          setDocumentVariables(activeVals);
        }
      } catch (err) {
        console.error("Failed to load master Document Variables:", err);
      }
    };
    fetchDocVariables();
  }, []);

  // Overlays confirmations
  const [deleteTemplateId, setDeleteTemplateId] = useState<number | null>(null);
  const [approveTemplateId, setApproveTemplateId] = useState<number | null>(null);
  const [rejectTemplateId, setRejectTemplateId] = useState<number | null>(null);

  // Form inputs
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Offer Letter' | 'Pay Slip' | 'Contract' | 'Agreement' | 'Custom'>('Custom');
  const [formDesc, setFormDesc] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [sealFile, setSealFile] = useState<File | null>(null);
  const [sigFile, setSigFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [sealUrl, setSealUrl] = useState<string | null>(null);
  const [sigUrl, setSigUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState('');
  const [sealError, setSealError] = useState('');
  const [sigError, setSigError] = useState('');
  const [editorMode, setEditorMode] = useState<'preview' | 'code'>('preview');
  const [templateHtml, setTemplateHtml] = useState<string>('');
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [showInsertVar, setShowInsertVar] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const insertVarRef = useRef<HTMLDivElement>(null);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const canvas = document.getElementById('a4-editor-canvas');
      if (canvas && canvas.contains(range.commonAncestorContainer)) {
        setSavedRange(range);
      }
    }
  };

  useEffect(() => {
    if ((viewState === 'create' || viewState === 'edit') && editorMode === 'preview' && canvasRef.current) {
      const currentHtml = canvasRef.current.innerHTML || templateHtml;
      canvasRef.current.innerHTML = renderTemplateContent(currentHtml, logoUrl, null, null);
    }
  }, [viewState, editorMode, logoUrl]);

  useEffect(() => {
    if ((viewState === 'edit' || viewState === 'create') && canvasRef.current) {
      const canvas = canvasRef.current;
      const canvasWidth = canvas.clientWidth || 672;
      const canvasHeight = canvas.clientHeight || 840;

      if (viewState === 'edit' && editingTemplate) {
        setSealPos({
          x: (getPercentX(editingTemplate.sealX, 15) * canvasWidth) / 100,
          y: (getPercentY(editingTemplate.sealY, 75) * canvasHeight) / 100
        });
        setSigPos({
          x: (getPercentX(editingTemplate.sigX, 50) * canvasWidth) / 100,
          y: (getPercentY(editingTemplate.sigY, 75) * canvasHeight) / 100
        });
        setSealWidth((getPercentWidth(editingTemplate.sealWidth, 10) * canvasWidth) / 100);
        setSigWidth((getPercentWidth(editingTemplate.sigWidth, 15) * canvasWidth) / 100);
      } else if (viewState === 'create') {
        setSealPos({ x: 0.15 * canvasWidth, y: 0.75 * canvasHeight });
        setSigPos({ x: 0.50 * canvasWidth, y: 0.75 * canvasHeight });
        setSealWidth(0.10 * canvasWidth);
        setSigWidth(0.15 * canvasWidth);
      }
    }
  }, [viewState, editingTemplate, canvasRef.current]);

  const handleSigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSigError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxLimit = 5 * 1024 * 1024;
      if (file.size > maxLimit) {
        setSigError('Signature size exceeds 5MB limit.');
        triggerToast('Signature exceeds 5MB limit!', 'error');
        setSigFile(null);
        setSigUrl(null);
      } else {
        setSigFile(file);
        setSigUrl(URL.createObjectURL(file));
        setShowSigOnPage(true);
        triggerToast('Signature uploaded.');
      }
    }
  };

  const [sealPos, setSealPos] = useState<{ x: number, y: number }>({ x: 100, y: 700 });
  const [sigPos, setSigPos] = useState<{ x: number, y: number }>({ x: 350, y: 700 });
  const [sealWidth, setSealWidth] = useState<number>(80);
  const [sigWidth, setSigWidth] = useState<number>(120);

  const handleResizeStart = (e: React.MouseEvent, type: 'seal' | 'sig') => {
    e.stopPropagation();
    e.preventDefault();

    const canvas = document.getElementById('a4-editor-canvas');
    if (!canvas) return;

    const startX = e.clientX;
    const startWidth = type === 'seal' ? sealWidth : sigWidth;

    const handleMouseMove = (moveEvt: MouseEvent) => {
      const dx = moveEvt.clientX - startX;

      const canvasStyle = window.getComputedStyle(canvas);
      const transform = canvasStyle.transform;
      let scale = 1;
      if (transform && transform !== 'none') {
        const matrix = transform.match(/^matrix\((.+)\)$/);
        if (matrix) {
          scale = parseFloat(matrix[1].split(',')[0]);
        }
      }

      const newWidth = Math.max(20, startWidth + (dx / scale));
      if (type === 'seal') {
        setSealWidth(newWidth);
      } else {
        setSigWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDragStart = (e: React.MouseEvent, type: 'seal' | 'sig') => {
    if (e.button !== 0) return;
    e.preventDefault();

    const canvas = document.getElementById('a4-editor-canvas');
    if (!canvas) return;

    const startX = e.clientX;
    const startY = e.clientY;

    const initialPos = type === 'seal' ? sealPos : sigPos;

    const handleMouseMove = (moveEvt: MouseEvent) => {
      const dx = moveEvt.clientX - startX;
      const dy = moveEvt.clientY - startY;

      const canvasStyle = window.getComputedStyle(canvas);
      const transform = canvasStyle.transform;
      let scale = 1;
      if (transform && transform !== 'none') {
        const matrix = transform.match(/^matrix\((.+)\)$/);
        if (matrix) {
          scale = parseFloat(matrix[1].split(',')[0]);
        }
      }

      const newX = initialPos.x + (dx / scale);
      const newY = initialPos.y + (dy / scale);

      if (type === 'seal') {
        setSealPos({ x: newX, y: newY });
      } else {
        setSigPos({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxLimit = 5 * 1024 * 1024;
      if (file.size > maxLimit) {
        setLogoError('Logo size exceeds 5MB limit.');
        triggerToast('Logo exceeds 5MB limit!', 'error');
        setLogoFile(null);
        setLogoUrl(null);
      } else {
        setLogoFile(file);
        setLogoUrl(URL.createObjectURL(file));
        triggerToast('Logo uploaded.');
      }
    }
  };

  const handleSealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSealError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxLimit = 5 * 1024 * 1024;
      if (file.size > maxLimit) {
        setSealError('Seal size exceeds 5MB limit.');
        triggerToast('Seal exceeds 5MB limit!', 'error');
        setSealFile(null);
        setSealUrl(null);
      } else {
        setSealFile(file);
        setSealUrl(URL.createObjectURL(file));
        setShowSealOnPage(true);
        triggerToast('Seal uploaded.');
      }
    }
  };

  const openCreateMode = () => {
    setFormName('');
    setFormCategory('Custom');
    setFormDesc('');
    setLogoFile(null);
    setSealFile(null);
    setSigFile(null);
    setLogoUrl(null);
    setSealUrl(null);
    setSigUrl(null);
    setLogoError('');
    setSealError('');
    setSigError('');
    setSealPos({ x: 15, y: 75 });
    setSigPos({ x: 50, y: 75 });
    setSealWidth(10);
    setSigWidth(15);
    setShowSealOnPage(false);
    setShowSigOnPage(false);
    setTemplateHtml(blankTemplateHtml);
    setEditorMode('preview');
    setViewState('create');
  };

  const openEditMode = (tpl: DocumentTemplate) => {
    setEditingTemplate(tpl);
    setFormName(tpl.name);
    setFormCategory(tpl.category);
    setFormDesc(`Official corporate ${tpl.category} forms template.`);
    setLogoFile(null);
    setSealFile(null);
    setSigFile(null);
    setLogoUrl(tpl.logoUrl || null);
    setSealUrl(tpl.sealUrl || null);
    setSigUrl(tpl.sigUrl || null);
    setLogoError('');
    setSealError('');
    setSigError('');
    setSealPos({
      x: getPercentX(tpl.sealX, 15),
      y: getPercentY(tpl.sealY, 75)
    });
    setSigPos({
      x: getPercentX(tpl.sigX, 50),
      y: getPercentY(tpl.sigY, 75)
    });
    setSealWidth(getPercentWidth(tpl.sealWidth, 10));
    setSigWidth(getPercentWidth(tpl.sigWidth, 15));
    setShowSealOnPage(!!tpl.sealUrl);
    setShowSigOnPage(!!tpl.sigUrl);
    const defaultHtml = tpl.content || (tpl.category === 'Offer Letter' ? offerLetterHtml
      : tpl.category === 'Pay Slip' ? paySlipHtml
        : tpl.category === 'Contract' ? contractHtml
          : tpl.category === 'Agreement' ? agreementHtml
            : blankTemplateHtml);
    setTemplateHtml(defaultHtml);
    setEditorMode('preview');
    setViewState('edit');
  };



  const handleFormat = (command: string, value: string = '') => {
    if (editorMode !== 'preview') {
      triggerToast('Switch to Preview mode to format text visually.', 'info');
      return;
    }
    const el = document.getElementById('a4-editor-canvas');
    if (el) {
      el.focus();
      if (savedRange) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(savedRange);
        }
      }
      document.execCommand(command, false, value);
      setTemplateHtml(el.innerHTML);
      saveSelection();
    }
  };

  const handlePrintTemplate = () => {
    if (!templateHtml) return;

    let baseHtml = renderTemplateContent(templateHtml, logoUrl, null, null);

    const canvas = document.getElementById('a4-editor-canvas');
    const canvasWidth = canvas?.clientWidth || 672;
    const canvasHeight = canvas?.clientHeight || 840;

    let overlays = '';
    if (sealUrl && showSealOnPage) {
      const sealX = Number(((sealPos.x / canvasWidth) * 100).toFixed(2));
      const sealY = Number(((sealPos.y / canvasHeight) * 100).toFixed(2));
      const sealW = Number(((sealWidth / canvasWidth) * 100).toFixed(2));
      overlays += `
        <div style="position: absolute; left: ${sealX}%; top: ${sealY}%; z-index: 50; mix-blend-mode: multiply; pointer-events: none; width: ${sealW}%;">
          <img src="${getFullImageUrl(sealUrl)}" style="width: 100%; height: auto; object-fit: contain;" />
        </div>
      `;
    }
    if (sigUrl && showSigOnPage) {
      const sigX = Number(((sigPos.x / canvasWidth) * 100).toFixed(2));
      const sigY = Number(((sigPos.y / canvasHeight) * 100).toFixed(2));
      const sigW = Number(((sigWidth / canvasWidth) * 100).toFixed(2));
      overlays += `
        <div style="position: absolute; left: ${sigX}%; top: ${sigY}%; z-index: 50; mix-blend-mode: multiply; pointer-events: none; width: ${sigW}%;">
          <img src="${getFullImageUrl(sigUrl)}" style="width: 100%; height: auto; object-fit: contain;" />
        </div>
      `;
    }

    let printedHtml = baseHtml;
    if (overlays) {
      const bodyCloseIndex = printedHtml.toLowerCase().lastIndexOf('</body>');
      if (bodyCloseIndex !== -1) {
        const preBodyHtml = printedHtml.substring(0, bodyCloseIndex);
        const lastDivIndex = preBodyHtml.lastIndexOf('</div>');
        if (lastDivIndex !== -1) {
          printedHtml = preBodyHtml.substring(0, lastDivIndex) + overlays + preBodyHtml.substring(lastDivIndex) + printedHtml.substring(bodyCloseIndex);
        } else {
          printedHtml = preBodyHtml + overlays + printedHtml.substring(bodyCloseIndex);
        }
      } else {
        const lastDivIndex = printedHtml.lastIndexOf('</div>');
        if (lastDivIndex !== -1) {
          printedHtml = printedHtml.substring(0, lastDivIndex) + overlays + printedHtml.substring(lastDivIndex);
        } else {
          printedHtml = printedHtml + overlays;
        }
      }
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Template</title>
            <style>
              body { margin: 0; padding: 0; }
              @media print {
                body { width: 210mm; height: 297mm; }
              }
            </style>
          </head>
          <body>
            ${printedHtml}
          </body>
        </html>
      `);
      doc.close();

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    }
  };

  const uploadDocResource = async (file: File | null, existingUrl: string | null): Promise<string | null> => {
    if (!file) return existingUrl;
    try {
      const res = await uploadFile<{ url: string }>(
        '/upload/document-resource',
        file,
        'file'
      );
      return (res as any).url || null;
    } catch (err) {
      console.error('File upload failed:', err);
      triggerToast('Failed to upload image file.', 'error');
      throw err;
    }
  };

  const handleSaveCreate = async () => {
    if (!formName.trim()) {
      triggerToast('Template name is required!', 'error');
      return;
    }
    try {
      const finalLogoUrl = await uploadDocResource(logoFile, logoUrl);
      const finalSealUrl = await uploadDocResource(sealFile, sealUrl);
      const finalSigUrl = await uploadDocResource(sigFile, sigUrl);

      const canvas = document.getElementById('a4-editor-canvas');
      const canvasWidth = canvas?.clientWidth || 672;
      const canvasHeight = canvas?.clientHeight || 840;

      const payload = {
        name: formName,
        category: formCategory,
        variables: formCategory === 'Offer Letter' ? 21 : formCategory === 'Pay Slip' ? 18 : formCategory === 'Contract' ? 25 : 12,
        updated: new Date().toLocaleDateString('en-US'),
        status: 'Pending Approval' as const,
        content: canvasRef.current ? canvasRef.current.innerHTML : templateHtml,
        logoUrl: finalLogoUrl || null,
        sealUrl: showSealOnPage ? finalSealUrl : null,
        sigUrl: showSigOnPage ? finalSigUrl : null,
        sealX: Number(((sealPos.x / canvasWidth) * 100).toFixed(2)),
        sealY: Number(((sealPos.y / canvasHeight) * 100).toFixed(2)),
        sealWidth: Number(((sealWidth / canvasWidth) * 100).toFixed(2)),
        sigX: Number(((sigPos.x / canvasWidth) * 100).toFixed(2)),
        sigY: Number(((sigPos.y / canvasHeight) * 100).toFixed(2)),
        sigWidth: Number(((sigWidth / canvasWidth) * 100).toFixed(2))
      };

      const saved = await documentApi.createTemplate(payload as any);
      setTemplates([...templates, saved as any]);
      setViewState('list');
      triggerToast(`${formName} created.`);
    } catch (err) {
      console.error('Failed to create template:', err);
      triggerToast('Failed to create template due to image upload or server error.', 'error');
    }
  };

  const handleSaveEdit = async () => {
    if (!formName.trim()) {
      triggerToast('Template name is required!', 'error');
      return;
    }
    if (!editingTemplate) return;

    try {
      const finalLogoUrl = await uploadDocResource(logoFile, logoUrl);
      const finalSealUrl = await uploadDocResource(sealFile, sealUrl);
      const finalSigUrl = await uploadDocResource(sigFile, sigUrl);

      const canvas = document.getElementById('a4-editor-canvas');
      const canvasWidth = canvas?.clientWidth || 672;
      const canvasHeight = canvas?.clientHeight || 840;

      const payload = {
        name: formName,
        category: formCategory,
        updated: new Date().toLocaleDateString('en-US'),
        content: canvasRef.current ? canvasRef.current.innerHTML : templateHtml,
        logoUrl: finalLogoUrl || null,
        sealUrl: showSealOnPage ? finalSealUrl : null,
        sigUrl: showSigOnPage ? finalSigUrl : null,
        sealX: Number(((sealPos.x / canvasWidth) * 100).toFixed(2)),
        sealY: Number(((sealPos.y / canvasHeight) * 100).toFixed(2)),
        sealWidth: Number(((sealWidth / canvasWidth) * 100).toFixed(2)),
        sigX: Number(((sigPos.x / canvasWidth) * 100).toFixed(2)),
        sigY: Number(((sigPos.y / canvasHeight) * 100).toFixed(2)),
        sigWidth: Number(((sigWidth / canvasWidth) * 100).toFixed(2))
      };

      await documentApi.updateTemplate(editingTemplate.id as number, payload as any);

      // Update template state with new values from payload
      setTemplates(templates.map(t =>
        t.id === editingTemplate.id ? { ...t, ...payload } : t
      ));
      setViewState('list');
      setEditingTemplate(null);
      triggerToast(`Changes saved for ${formName}.`);
    } catch (err) {
      console.error('Failed to update template:', err);
      triggerToast('Failed to update template due to image upload or server error.', 'error');
    }
  };

  const handleApproveTemplate = async () => {
    if (!approveTemplateId) return;
    try {
      await documentApi.updateTemplate(approveTemplateId, { status: 'Approved' } as any);
    } catch (err) { console.warn('Approve sync failed:', err); }
    setTemplates(templates.map(t => t.id === approveTemplateId ? { ...t, status: 'Approved' } : t));
    triggerToast('Template approved successfully.');
    setApproveTemplateId(null);
  };

  const handleRejectTemplate = async () => {
    if (!rejectTemplateId) return;
    try {
      await documentApi.updateTemplate(rejectTemplateId, { status: 'Rejected' } as any);
    } catch (err) { console.warn('Reject sync failed:', err); }
    setTemplates(templates.map(t => t.id === rejectTemplateId ? { ...t, status: 'Rejected' } : t));
    triggerToast('Template status set to Rejected.', 'info');
    setRejectTemplateId(null);
  };

  const handleDeleteTemplate = async () => {
    if (!deleteTemplateId) return;
    try {
      await documentApi.deleteTemplate(deleteTemplateId);
    } catch (err) { console.warn('Delete sync failed:', err); }
    setTemplates(templates.filter(t => t.id !== deleteTemplateId));
    triggerToast('Template removed successfully.');
    setDeleteTemplateId(null);
  };

  return (
    <div className="md:flex-1 h-auto md:overflow-hidden overflow-visible flex flex-col">
      {/* 1. Templates List view */}
      {viewState === 'list' && (
        <div className="bg-white rounded-t-2xl border-x border-t border-slate-100 flex flex-col md:flex-1 h-auto md:overflow-hidden overflow-visible shadow-xs">

          {/* List Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0 z-10">
            <div>
              <h2 className="text-base font-extrabold text-gray-800">Document Templates</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage and customize corporate layouts</p>
            </div>
            <button
              onClick={openCreateMode}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs animate-none cursor-pointer"
            >
              <Plus size={14} /> Create Template
            </button>
          </div>

          {/* List scroll grid container */}
          <div className="md:flex-1 h-auto md:overflow-y-auto overflow-visible p-4 bg-slate-50/20 scrollbar-thin">
            {templates.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 p-12 text-center flex flex-col items-center">
                <FolderOpen size={48} className="text-gray-300 mb-3" />
                <p className="text-sm font-bold text-gray-700">No Templates Defined</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm">Create templates of Offer Letters or Salary Slips to easily generate records for employees.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 relative flex flex-col justify-between hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                            <FileSignature size={16} />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-gray-800 line-clamp-1">{tpl.name}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{tpl.category}</p>
                          </div>
                        </div>

                        {/* Options 3-dot dropdown menu */}
                        <div className="relative">
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === tpl.id ? null : tpl.id)}
                            className="p-1 rounded-lg text-gray-400 hover:bg-slate-50 transition cursor-pointer"
                          >
                            <MoreVertical size={15} />
                          </button>

                          <AnimatePresence>
                            {activeDropdown === tpl.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.96 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.96 }}
                                  className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 text-xs font-semibold text-slate-700 divide-y divide-slate-50"
                                >
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        openEditMode(tpl);
                                      }}
                                      className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Edit size={13} className="text-gray-400" /> Edit Template
                                    </button>
                                  </div>
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setApproveTemplateId(tpl.id);
                                      }}
                                      className="w-full px-3 py-1.5 text-left hover:bg-slate-50 text-emerald-600 flex items-center gap-2 cursor-pointer"
                                    >
                                      <FileCheck size={13} /> Approve Template
                                    </button>
                                    <button
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setRejectTemplateId(tpl.id);
                                      }}
                                      className="w-full px-3 py-1.5 text-left hover:bg-slate-50 text-amber-600 flex items-center gap-2 cursor-pointer"
                                    >
                                      <FileX size={13} /> Reject Template
                                    </button>
                                  </div>
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setDeleteTemplateId(tpl.id);
                                      }}
                                      className="w-full px-3 py-1.5 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Trash2 size={13} /> Delete Template
                                    </button>
                                  </div>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Tag size={12} className="text-purple-400" /> {tpl.variables} Variables</span>
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-400" /> Upd: {tpl.updated}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-lg border ${tpl.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100/30' :
                        tpl.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100/30' :
                          'bg-amber-50 text-amber-700 border-amber-100/30'
                        }`}>
                        {tpl.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Approve template popup */}
          <AnimatePresence>
            {approveTemplateId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setApproveTemplateId(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative bg-white rounded-2xl shadow-xl p-5 w-full max-w-md z-10 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3"><FileCheck size={20} /></div>
                  <h3 className="text-sm font-extrabold text-gray-800">Approve Document Template</h3>
                  <p className="text-xs text-gray-500 mt-1">Are you sure you want to approve this template? It will be active for document generation.</p>
                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setApproveTemplateId(null)} className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-gray-500 transition cursor-pointer">Cancel</button>
                    <button onClick={handleApproveTemplate} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer">Approve</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Confirm Reject template popup */}
          <AnimatePresence>
            {rejectTemplateId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRejectTemplateId(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative bg-white rounded-2xl shadow-xl p-5 w-full max-w-md z-10 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3"><FileX size={20} /></div>
                  <h3 className="text-sm font-extrabold text-gray-800">Reject Template</h3>
                  <p className="text-xs text-gray-500 mt-1">Confirm rejection of this template. It will not be active for document generation.</p>
                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setRejectTemplateId(null)} className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-gray-500 transition cursor-pointer">Cancel</button>
                    <button onClick={handleRejectTemplate} className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition cursor-pointer">Reject</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Confirm Delete template popup */}
          <AnimatePresence>
            {deleteTemplateId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTemplateId(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative bg-white rounded-2xl shadow-xl p-5 w-full max-w-md z-10 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3"><Trash2 size={20} /></div>
                  <h3 className="text-sm font-extrabold text-gray-800">Delete Template</h3>
                  <p className="text-xs text-gray-500 mt-1">Permanently delete this template? Any document generated with it will not be affected.</p>
                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setDeleteTemplateId(null)} className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-gray-500 transition cursor-pointer">Cancel</button>
                    <button onClick={handleDeleteTemplate} className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer">Delete</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 2. Create or Edit Template Forms (Inline, keeping header/sidebar/navbar layout exactly matching layout) */}
      {(viewState === 'create' || viewState === 'edit') && (
        <div className="bg-white flex flex-col md:flex-1 h-auto md:overflow-hidden overflow-visible">
          {/* Header Action Bar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0 z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewState('list')}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl transition text-slate-500"
              >
                <ArrowLeft size={15} />
              </button>
              <div>
                <h2 className="text-base font-extrabold text-gray-800">
                  {viewState === 'create' ? 'Create New Template' : `Edit Template - ${editingTemplate?.name}`}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Define corporate styles and brand assets.</p>
              </div>
            </div>


          </div>

          {/* Form Content body (scrollable) */}
          <div className="md:flex-1 h-auto md:overflow-y-auto overflow-visible p-4 bg-slate-50/20 space-y-4 scrollbar-thin">
            {/* Form details: Row 1 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Template Name */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Template Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sales Pay Slip"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-gray-600 outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
                  <div className="relative">
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        const cat = e.target.value as any;
                        setFormCategory(cat);
                        const defaultHtml = cat === 'Offer Letter' ? offerLetterHtml
                          : cat === 'Pay Slip' ? paySlipHtml
                            : cat === 'Contract' ? contractHtml
                              : cat === 'Agreement' ? agreementHtml
                                : blankTemplateHtml;
                        setTemplateHtml(defaultHtml);
                        if (canvasRef.current) {
                          canvasRef.current.innerHTML = renderTemplateContent(defaultHtml, logoUrl, null, null);
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none appearance-none cursor-pointer focus:bg-white focus:border-blue-500 transition"
                    >
                      <option value="Offer Letter">Offer Letter</option>
                      <option value="Pay Slip">Pay Slip</option>
                      <option value="Contract">Contract</option>
                      <option value="Agreement">Agreement</option>
                      <option value="Custom">Custom Template</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Description</label>
                  <input
                    type="text"
                    placeholder="Details of the template usage..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-gray-600 outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>

                {/* Company Logo (max 5MB) */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Company Logo (Max 5MB)</label>
                  {logoUrl ? (
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2">
                      <div className="w-10 h-10 border border-slate-200 rounded-lg overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                        <img src={getFullImageUrl(logoUrl)} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-600 truncate">{logoFile ? logoFile.name : logoUrl.split('/').pop()}</p>
                        <button
                          type="button"
                          onClick={() => { setLogoFile(null); setLogoUrl(null); }}
                          className="text-[9px] font-bold text-rose-500 hover:text-rose-600 transition"
                        >
                          Remove Logo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 hover:bg-white transition cursor-pointer overflow-hidden">
                      <Upload size={14} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-500 truncate">Upload Logo</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                  {logoError && (
                    <p className="text-[9px] font-bold text-rose-500 mt-1">
                      {logoError}
                    </p>
                  )}
                </div>

                {/* Company Seal (max 5MB) */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Company Seal (Max 5MB)</label>
                  {sealUrl ? (
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2">
                      <div className="w-10 h-10 border border-slate-200 rounded-lg overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                        <img src={getFullImageUrl(sealUrl)} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-600 truncate">{sealFile ? sealFile.name : sealUrl.split('/').pop()}</p>
                        <div className="flex gap-2.5 mt-0.5">
                          <button
                            type="button"
                            onClick={() => { setSealFile(null); setSealUrl(null); setShowSealOnPage(false); }}
                            className="text-[9px] font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowSealOnPage(!showSealOnPage)}
                            className={`text-[9px] font-bold transition cursor-pointer ${showSealOnPage ? 'text-amber-500 hover:text-amber-600' : 'text-blue-500 hover:text-blue-600'}`}
                          >
                            {showSealOnPage ? 'Hide from Page' : 'Place on Page'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 hover:bg-white transition cursor-pointer overflow-hidden">
                      <ImageIcon size={14} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-500 truncate">Upload Seal</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSealUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                  {sealError && (
                    <p className="text-[9px] font-bold text-rose-500 mt-1">
                      {sealError}
                    </p>
                  )}
                </div>

                {/* Brand Signature (max 5MB) */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Brand Signature (Max 5MB)</label>
                  {sigUrl ? (
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2">
                      <div className="w-10 h-10 border border-slate-200 rounded-lg overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                        <img src={getFullImageUrl(sigUrl)} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-600 truncate">{sigFile ? sigFile.name : sigUrl.split('/').pop()}</p>
                        <div className="flex gap-2.5 mt-0.5">
                          <button
                            type="button"
                            onClick={() => { setSigFile(null); setSigUrl(null); setShowSigOnPage(false); }}
                            className="text-[9px] font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowSigOnPage(!showSigOnPage)}
                            className={`text-[9px] font-bold transition coursor-pointer ${showSigOnPage ? 'text-amber-500 hover:text-amber-600' : 'text-blue-500 hover:text-blue-600'}`}
                          >
                            {showSigOnPage ? 'Hide from Page' : 'Place on Page'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 hover:bg-white transition cursor-pointer overflow-hidden">
                      <FileSignature size={14} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-500 truncate">Upload Signature</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSigUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                  {sigError && (
                    <p className="text-[9px] font-bold text-rose-500 mt-1">
                      {sigError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Template Content Editor Section (A4 Content area matching Image 3) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
              {editorMode === 'preview' ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider">Template Content</label>
                  </div>

                  {/* MNC Rich Editor Toolbar matching image 3 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-t-xl p-2.5 space-y-2">
                    {/* Row 1 toolbar controls */}
                    <div className="flex flex-wrap items-center gap-1.5 text-slate-600 text-xs">
                      {/* Page Size Dropdown */}
                      <select className="bg-white border border-slate-200 rounded px-2.5 py-1 text-[11px] font-medium outline-none focus:border-blue-500 appearance-none cursor-pointer pr-5 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a0aec0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:7px_7px] bg-[right_8px_center] bg-no-repeat">
                        <option>A4 • Blank Page</option>
                        <option>Letter • Blank Page</option>
                      </select>

                      {/* File actions */}
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="New Page"><File size={13} /></button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Upload"><Upload size={13} /></button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Download"><Download size={13} /></button>

                      <span className="w-px h-3.5 bg-slate-350 mx-1"></span>

                      {/* Formatting */}
                      <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('bold')} type="button" className="w-6 h-6 hover:bg-slate-200 rounded flex items-center justify-center font-bold text-xs text-slate-700" title="Bold">B</button>
                      <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('italic')} type="button" className="w-6 h-6 hover:bg-slate-200 rounded flex items-center justify-center italic text-xs text-slate-700" title="Italic">I</button>
                      <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('underline')} type="button" className="w-6 h-6 hover:bg-slate-200 rounded flex items-center justify-center underline text-xs text-slate-700" title="Underline">U</button>
                      <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('strikeThrough')} type="button" className="w-6 h-6 hover:bg-slate-200 rounded flex items-center justify-center line-through text-xs text-slate-700" title="Strikethrough">S</button>

                      <span className="w-px h-3.5 bg-slate-350 mx-1"></span>

                      {/* Font and size */}
                      <select onChange={(e) => handleFormat('fontName', e.target.value)} className="bg-white border border-slate-200 rounded px-2.5 py-0.5 text-[11px] font-medium outline-none cursor-pointer">
                        <option value="Inter">Inter</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Courier New">Courier New</option>
                      </select>

                      <select onChange={(e) => handleFormat('fontSize', e.target.value)} className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-medium outline-none cursor-pointer">
                        <option value="1">7 pt</option>
                        <option value="1">8 pt</option>
                        <option value="2">9 pt</option>
                        <option value="2">10 pt</option>
                        <option value="3">12 pt</option>
                        <option value="4">14 pt</option>
                        <option value="5">16 pt</option>
                        <option value="6">18 pt</option>
                        <option value="7">24 pt</option>
                      </select>

                      <span className="w-px h-3.5 bg-slate-350 mx-1"></span>

                      {/* Alignment */}
                      <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('justifyLeft')} type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Align Left">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h10M4 18h16" /></svg>
                      </button>
                      <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('justifyCenter')} type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Align Center">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M7 12h10M4 18h16" /></svg>
                      </button>
                      <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('justifyRight')} type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Align Right">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M10 12h10M4 18h16" /></svg>
                      </button>
                      <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('justifyFull')} type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Align Justify">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                      </button>

                      <span className="w-px h-3.5 bg-slate-350 mx-1"></span>

                      {/* Lists & Table */}
                      <button onClick={() => handleFormat('insertUnorderedList')} type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Bullet list"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h1M9 6h11M4 12h1M9 12h11M4 18h1M9 18h11" /></svg></button>
                      <button onClick={() => handleFormat('insertOrderedList')} type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Numbered list"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h1v4M4 10h2M10 6h10M10 12h10M10 18h10" /></svg></button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Table"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 10h18M3 14h18M12 3v18" /></svg></button>

                      <span className="w-px h-3.5 bg-slate-350 mx-1"></span>

                      {/* History & printing */}
                      <button onClick={() => handleFormat('undo')} type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Undo"><Undo size={13} /></button>
                      <button onClick={() => handleFormat('redo')} type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Redo"><Redo size={13} /></button>
                      <button onClick={handlePrintTemplate} type="button" className="p-1 hover:bg-slate-200 rounded text-slate-500" title="Print"><Printer size={13} /></button>
                      <button
                        type="button"
                        onClick={() => setEditorMode('code')}
                        className="p-1 rounded transition hover:bg-slate-200 text-slate-500"
                        title="Source Code"
                      >
                        <Code size={13} />
                      </button>
                    </div>

                    {/* Row 2 dropdown filters */}
                    <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-slate-200/50 text-[11px]">
                      <select className="bg-white border border-slate-200 rounded px-2 py-0.5 outline-none font-medium text-slate-600">
                        <option>All</option>
                        <option>System Variables</option>
                        <option>Custom Variables</option>
                      </select>

                      {/* Custom scrollable Insert Variable dropdown */}
                      <div ref={insertVarRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setShowInsertVar(v => !v)}
                          className="bg-white border border-slate-200 rounded px-2 py-0.5 outline-none text-slate-500 font-medium text-[11px] flex items-center gap-1.5 hover:bg-slate-50 transition cursor-pointer"
                        >
                          Insert variable...
                          <ChevronDown size={11} className={`transition-transform ${showInsertVar ? 'rotate-180' : ''}`} />
                        </button>

                        {showInsertVar && (
                          <>
                            {/* Backdrop to close */}
                            <div className="fixed inset-0 z-10" onClick={() => setShowInsertVar(false)} />
                            <div
                              className="absolute left-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-lg overflow-y-auto scrollbar-thin"
                              style={{ maxHeight: '50vh', minWidth: '180px' }}
                            >
                              {/* Common variables */}
                              <div className="px-2 pt-2 pb-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-1">Common</p>
                                {[
                                  { val: 'issue_date', label: 'issue_date (Today)' },
                                  { val: 'date_of_leaving', label: 'date_of_leaving' },
                                ].map(item => (
                                  <button
                                    key={item.val}
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(`{{${item.val}}}`);
                                      triggerToast(`Variable {{${item.val}}} copied!`, 'success');
                                      setShowInsertVar(false);
                                    }}
                                    className="w-full text-left px-2 py-1 text-[11px] text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition cursor-pointer font-medium"
                                  >
                                    {`{{ ${item.val} }}`}
                                    <span className="text-[10px] text-slate-400 ml-1">{item.label.includes('(') ? item.label.match(/\((.+)\)/)?.[1] : ''}</span>
                                  </button>
                                ))}
                              </div>

                              {/* Category variables */}
                              {(() => {
                                let vars: { val: string; label: string }[] = [];
                                if (formCategory === 'Offer Letter') vars = [
                                  { val: 'employee_name', label: 'Employee Name' },
                                  { val: 'job_title', label: 'Job Title' },
                                  { val: 'department', label: 'Department' },
                                  { val: 'start_date', label: 'Start Date' },
                                  { val: 'salary', label: 'Monthly Salary' },
                                  { val: 'ctc', label: 'Annual CTC' },
                                  { val: 'company_name', label: 'Company Name' },
                                ];
                                else if (formCategory === 'Pay Slip') vars = [
                                  { val: 'employee_name', label: 'Employee Name' },
                                  { val: 'employee_id', label: 'Employee ID' },
                                  { val: 'department', label: 'Department' },
                                  { val: 'month_year', label: 'Month & Year' },
                                  { val: 'basic', label: 'Basic Salary' },
                                  { val: 'hra', label: 'HRA' },
                                  { val: 'allowance', label: 'Allowance' },
                                  { val: 'pf', label: 'PF' },
                                  { val: 'tax', label: 'Tax' },
                                ];
                                else if (formCategory === 'Contract') vars = [
                                  { val: 'employee_name', label: 'Employee Name' },
                                  { val: 'job_title', label: 'Job Title' },
                                  { val: 'start_date', label: 'Start Date' },
                                  { val: 'salary', label: 'Salary' },
                                  { val: 'probation_months', label: 'Probation Months' },
                                  { val: 'notice_days', label: 'Notice Days' },
                                  { val: 'company_name', label: 'Company Name' },
                                ];
                                else if (formCategory === 'Agreement') vars = [
                                  { val: 'employee_name', label: 'Employee Name' },
                                  { val: 'effective_date', label: 'Effective Date' },
                                  { val: 'company_name', label: 'Company Name' },
                                ];

                                if (vars.length === 0) return null;
                                return (
                                  <div className="px-2 pb-1 border-t border-slate-100 mt-1 pt-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-1">{formCategory}</p>
                                    {vars.map(item => (
                                      <button
                                        key={item.val}
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(`{{${item.val}}}`);
                                          triggerToast(`Variable {{${item.val}}} copied!`, 'success');
                                          setShowInsertVar(false);
                                        }}
                                        className="w-full text-left px-2 py-1 text-[11px] text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition cursor-pointer font-medium"
                                      >
                                        {`{{ ${item.val} }}`}
                                        <span className="text-[10px] text-slate-400 ml-1">{item.label}</span>
                                      </button>
                                    ))}
                                  </div>
                                );
                              })()}

                              {/* Custom/master variables */}
                              {documentVariables && documentVariables.length > 0 && (
                                <div className="px-2 pb-2 border-t border-slate-100 mt-1 pt-1">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-1">Custom</p>
                                  {documentVariables.map((v: any) => (
                                    <button
                                      key={v.id}
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(`{{${v.value}}}`);
                                        triggerToast(`Variable {{${v.value}}} copied!`, 'success');
                                        setShowInsertVar(false);
                                      }}
                                      className="w-full text-left px-2 py-1 text-[11px] text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition cursor-pointer font-medium"
                                    >
                                      {`{{ ${v.value} }}`}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <select className="bg-white border border-slate-200 rounded px-2 py-0.5 outline-none text-slate-500 font-medium">
                        <option>Used variables (21)</option>
                        <option>employee_name</option>
                        <option>department</option>
                        <option>company_name</option>
                        <option>job_title</option>
                        <option>salary</option>
                        <option>start_date</option>
                      </select>
                    </div>
                  </div>

                  {/* Document Content A4 Sheet Canvas */}
                  <div className="bg-slate-100 border border-slate-200 rounded-b-xl p-4 md:p-6 overflow-y-auto max-h-[460px] shadow-inner flex justify-center scrollbar-thin">
                    <div className="w-full max-w-2xl relative shadow-md">
                      <div
                        ref={canvasRef}
                        id="a4-editor-canvas"
                        contentEditable={true}
                        suppressContentEditableWarning
                        onInput={(e) => {
                          setTemplateHtml(e.currentTarget.innerHTML);
                        }}
                        onBlur={(e) => {
                          setTemplateHtml(e.currentTarget.innerHTML);
                          saveSelection();
                        }}
                        onMouseUp={saveSelection}
                        onKeyUp={saveSelection}
                        onFocus={saveSelection}
                        className="w-full h-auto min-h-[840px] animate-[fadeIn_0.15s_ease-out] outline-none bg-white"
                      />

                      {/* Render Draggable Seal Overlay */}
                      {sealUrl && showSealOnPage && (
                        <div
                          onMouseDown={(e) => handleDragStart(e, 'seal')}
                          style={{
                            position: 'absolute',
                            left: `${sealPos.x}px`,
                            top: `${sealPos.y}px`,
                            width: `${sealWidth}px`,
                            height: 'auto',
                            cursor: 'move',
                            zIndex: 50,
                            mixBlendMode: 'multiply',
                            userSelect: 'none'
                          }}
                          className="group"
                          title="Drag to place seal"
                        >
                          <img src={getFullImageUrl(sealUrl)} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} className="pointer-events-none select-none" />
                          <div
                            onMouseDown={(e) => handleResizeStart(e, 'seal')}
                            className="hidden group-hover:block absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-blue-600 border border-white rounded-full cursor-se-resize shadow-sm"
                            title="Drag to resize seal"
                          />
                        </div>
                      )}

                      {/* Render Draggable Signature Overlay */}
                      {sigUrl && showSigOnPage && (
                        <div
                          onMouseDown={(e) => handleDragStart(e, 'sig')}
                          style={{
                            position: 'absolute',
                            left: `${sigPos.x}px`,
                            top: `${sigPos.y}px`,
                            width: `${sigWidth}px`,
                            height: 'auto',
                            cursor: 'move',
                            zIndex: 50,
                            mixBlendMode: 'multiply',
                            userSelect: 'none'
                          }}
                          className="group"
                          title="Drag to place signature"
                        >
                          <img src={getFullImageUrl(sigUrl)} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} className="pointer-events-none select-none" />
                          <div
                            onMouseDown={(e) => handleResizeStart(e, 'sig')}
                            className="hidden group-hover:block absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-blue-600 border border-white rounded-full cursor-se-resize shadow-sm"
                            title="Drag to resize signature"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-[fadeIn_0.15s_ease-out]">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Code size={16} className="text-blue-600" />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Source Code Editor</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditorMode('preview')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold tracking-wide uppercase transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Eye size={12} /> Preview
                    </button>
                  </div>
                  <textarea
                    value={templateHtml}
                    onChange={(e) => setTemplateHtml(e.target.value)}
                    className="w-full h-[520px] font-mono text-[10px] p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 scrollbar-thin whitespace-pre"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Actions bar inside editor view wrapper */}
          <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white flex-shrink-0 z-10">
            <button
              type="button"
              onClick={() => setViewState('list')}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 bg-white rounded-xl text-xs font-bold text-gray-500 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={viewState === 'create' ? handleSaveCreate : handleSaveEdit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}