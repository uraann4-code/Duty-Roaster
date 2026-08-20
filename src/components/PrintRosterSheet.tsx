import React from 'react';
import { OfficialItem, UserSettings } from '../types';
import { formatDateDisplay, formatTimeDisplay } from '../storage';

interface PrintRosterSheetProps {
  date: string;
  items: OfficialItem[];
  settings: UserSettings;
}

export const PrintRosterSheet: React.FC<PrintRosterSheetProps> = ({
  date,
  items,
  settings,
}) => {
  // Sort items chronologically by time
  const sortedItems = [...items].sort((a, b) => (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59'));

  const directivesCount = sortedItems.filter((i) => i.type === 'directive').length;
  const meetingsCount = sortedItems.filter((i) => i.type === 'meeting').length;
  const correspondenceCount = sortedItems.filter((i) => i.type === 'correspondence').length;
  const pendingCount = sortedItems.filter((i) => i.status !== 'completed').length;
  const completedCount = sortedItems.filter((i) => i.status === 'completed').length;

  const printTimestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="print-container bg-white text-black p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm max-w-5xl mx-auto font-sans">
      {/* Official Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <div className="text-[11pt] tracking-widest uppercase font-semibold text-slate-700">
          {settings.officeName || 'EXECUTIVE SECRETARIAT'}
        </div>
        <div className="text-[10pt] uppercase text-slate-600 font-medium">
          {settings.departmentName || 'ADMINISTRATION & COORDINATION DIRECTORATE'}
        </div>
        <div className="text-[16pt] font-black tracking-tight text-black mt-2 font-display uppercase border-y border-black py-1 my-2">
          DAILY EXECUTIVE DUTY ROSTER & ACTION PLAN
        </div>
        <div className="flex flex-wrap items-center justify-between text-[10pt] font-medium text-slate-800 pt-1">
          <div>
            <span className="font-bold">ROSTER DATE: </span>
            <span className="underline font-bold text-black">{formatDateDisplay(date)}</span>
          </div>
          <div>
            <span className="font-bold">OFFICER DESK: </span>
            <span>{settings.officerName} ({settings.officerTitle})</span>
          </div>
          <div>
            <span className="font-bold">SUBMITTED TO: </span>
            <span>{settings.superiorTitle}</span>
          </div>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-5 gap-2 border border-slate-400 bg-slate-100/70 p-2 mb-4 text-center text-[9pt]">
        <div className="border-r border-slate-300">
          <div className="text-slate-500 font-bold uppercase text-[8pt]">Total Tasks</div>
          <div className="font-bold text-[12pt] text-black">{sortedItems.length}</div>
        </div>
        <div className="border-r border-slate-300">
          <div className="text-purple-800 font-bold uppercase text-[8pt]">Boss Directives</div>
          <div className="font-bold text-[12pt] text-purple-900">{directivesCount}</div>
        </div>
        <div className="border-r border-slate-300">
          <div className="text-blue-800 font-bold uppercase text-[8pt]">Meetings</div>
          <div className="font-bold text-[12pt] text-blue-900">{meetingsCount}</div>
        </div>
        <div className="border-r border-slate-300">
          <div className="text-amber-800 font-bold uppercase text-[8pt]">Dak / Letters</div>
          <div className="font-bold text-[12pt] text-amber-900">{correspondenceCount}</div>
        </div>
        <div>
          <div className="text-red-800 font-bold uppercase text-[8pt]">Pending Actions</div>
          <div className="font-bold text-[12pt] text-red-900">{pendingCount}</div>
        </div>
      </div>

      {/* Roster Table */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-300 text-slate-500 text-[11pt]">
          No duties, meetings, or correspondence recorded for {formatDateDisplay(date)}.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="print-table w-full border-collapse border border-black text-[9.5pt]">
            <thead>
              <tr className="bg-slate-200 text-black uppercase font-bold text-[8.5pt]">
                <th className="border border-black p-2 text-center w-10">Sr #</th>
                <th className="border border-black p-2 text-left w-24">Time</th>
                <th className="border border-black p-2 text-left w-32">Ref / Diary No</th>
                <th className="border border-black p-2 text-left">Subject & Action Required</th>
                <th className="border border-black p-2 text-left w-36">Authority / Source</th>
                <th className="border border-black p-2 text-center w-24">Status</th>
                <th className="border border-black p-2 text-center w-20">Signoff</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}
                >
                  {/* Serial */}
                  <td className="border border-black p-2 text-center font-bold">
                    {index + 1}
                  </td>

                  {/* Scheduled Time */}
                  <td className="border border-black p-2 font-bold whitespace-nowrap">
                    {formatTimeDisplay(item.dueTime)}
                    {item.priority === 'urgent' && (
                      <span className="block text-[7.5pt] font-extrabold text-red-700 uppercase">
                        [URGENT]
                      </span>
                    )}
                  </td>

                  {/* Ref / Diary No */}
                  <td className="border border-black p-2 font-mono font-medium text-[8.5pt]">
                    <div>{item.referenceNo}</div>
                    <span className="text-[7.5pt] text-slate-600 font-sans block uppercase">
                      {item.type}
                    </span>
                  </td>

                  {/* Subject & Instructions */}
                  <td className="border border-black p-2">
                    <div className="font-bold text-black text-[10pt] leading-tight">
                      {item.title}
                    </div>

                    {item.actionRequired && (
                      <div className="mt-1 text-[8.5pt] text-slate-800 bg-slate-100 p-1 rounded font-medium">
                        <span className="font-bold">Required Output: </span>
                        {item.actionRequired}
                      </div>
                    )}

                    {item.locationOrVenue && (
                      <div className="text-[8.5pt] text-blue-900 mt-0.5">
                        <span className="font-bold">Venue: </span>{item.locationOrVenue}
                      </div>
                    )}

                    {item.checklist && item.checklist.length > 0 && (
                      <div className="mt-1 text-[8pt] text-slate-700 pl-2 border-l border-slate-400 space-y-0.5">
                        {item.checklist.map((c) => (
                          <div key={c.id} className="flex items-center space-x-1.5">
                            <span>{c.completed ? '☑' : '☐'}</span>
                            <span className={c.completed ? 'line-through text-slate-500' : ''}>
                              {c.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Assigned By / Source */}
                  <td className="border border-black p-2 text-[9pt]">
                    <div className="font-semibold text-black">{item.assignedBy}</div>
                    {item.correspondenceSource && (
                      <div className="text-[8pt] text-slate-600 mt-0.5">
                        {item.correspondenceSource}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="border border-black p-2 text-center text-[8.5pt] font-bold">
                    {item.status === 'completed' ? (
                      <span className="text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded block">
                        DISPOSED
                      </span>
                    ) : item.status === 'in_progress' ? (
                      <span className="text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded block">
                        IN PROCESS
                      </span>
                    ) : (
                      <span className="text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded block">
                        PENDING
                      </span>
                    )}
                  </td>

                  {/* Signoff / Tick box */}
                  <td className="border border-black p-2 text-center text-slate-400">
                    <div className="w-5 h-5 border border-black mx-auto rounded-xs">
                      {item.status === 'completed' && (
                        <span className="text-black font-bold text-xs leading-none">✓</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Official Signatures Block */}
      <div className="mt-8 pt-6 border-t-2 border-black flex items-end justify-between text-[9.5pt] text-black">
        <div className="text-left space-y-1">
          <div className="font-bold">{settings.officerName}</div>
          <div className="text-slate-600 text-[8.5pt]">{settings.officerTitle}</div>
          <div className="text-slate-500 text-[7.5pt] font-mono">
            Printed: {printTimestamp}
          </div>
          <div className="pt-8 border-t border-black w-48 text-[8pt] text-slate-700 font-semibold">
            Signature of Preparing Officer
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="font-bold">{settings.superiorTitle}</div>
          <div className="text-slate-600 text-[8.5pt]">Competent Authority / Reviewing Head</div>
          <div className="text-slate-500 text-[7.5pt]">Office Stamp & Seal</div>
          <div className="pt-8 border-t border-black w-48 text-[8pt] text-slate-700 font-semibold text-right ml-auto">
            Signature of Worthy Sir / Head
          </div>
        </div>
      </div>
    </div>
  );
};
