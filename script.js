const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
});
mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open"); menuToggle?.setAttribute("aria-expanded", "false");
}));

// Vietnamese lunar calendar conversion, Hồ Ngọc Đức algorithm, civil timezone UTC+7.
// Uses integer Julian day numbers to avoid browser date/timezone drift.
const TZ = 7;
const floor = Math.floor;
function jdFromDate(dd, mm, yy) {
  const a = floor((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
  let jd = dd + floor((153 * m + 2) / 5) + 365 * y + floor(y / 4) - floor(y / 100) + floor(y / 400) - 32045;
  if (jd < 2299161) jd = dd + floor((153 * m + 2) / 5) + 365 * y + floor(y / 4) - 32083;
  return jd;
}
function jdToDate(jd) {
  let a, b, c;
  if (jd > 2299160) { a = jd + 32044; b = floor((4 * a + 3) / 146097); c = a - floor(b * 146097 / 4); }
  else { b = 0; c = jd + 32082; }
  const d = floor((4 * c + 3) / 1461), e = c - floor(1461 * d / 4), m = floor((5 * e + 2) / 153);
  return [e - floor((153 * m + 2) / 5) + 1, m + 3 - 12 * floor(m / 10), b * 100 + d - 4800 + floor(m / 10)];
}
function newMoonDay(k) {
  const T = k / 1236.85, T2 = T*T, T3 = T2*T, dr = Math.PI/180;
  let Jd1 = 2415020.75933 + 29.53058868*k + 0.0001178*T2 - 0.000000155*T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87*T - 0.009173*T2)*dr);
  const M = 359.2242 + 29.10535608*k - 0.0000333*T2 - 0.00000347*T3;
  const Mp = 306.0253 + 385.81691806*k + 0.0107306*T2 + 0.00001236*T3;
  const F = 21.2964 + 390.67050646*k - 0.0016528*T2 - 0.00000239*T3;
  let C1 = (0.1734 - 0.000393*T)*Math.sin(M*dr) + 0.0021*Math.sin(2*dr*M);
  C1 += -0.4068*Math.sin(Mp*dr) + 0.0161*Math.sin(2*dr*Mp) - 0.0004*Math.sin(3*dr*Mp);
  C1 += 0.0104*Math.sin(2*dr*F) - 0.0051*Math.sin(dr*(M+Mp)) - 0.0074*Math.sin(dr*(M-Mp));
  C1 += 0.0004*Math.sin(dr*(2*F+M)) - 0.0004*Math.sin(dr*(2*F-M)) - 0.0006*Math.sin(dr*(2*F+Mp));
  C1 += 0.0010*Math.sin(dr*(2*F-Mp)) + 0.0005*Math.sin(dr*(2*Mp+M));
  const dt = T < -11 ? 0.001 + 0.000839*T + 0.0002261*T2 - 0.00000845*T3 - 0.000000081*T*T3 : -0.000278 + 0.000265*T + 0.000262*T2;
  return floor(Jd1 + C1 - dt + 0.5 + TZ/24);
}
function sunLongitude(dayNumber) {
  const T = (dayNumber - 2451545.5 - TZ/24)/36525, T2=T*T, dr=Math.PI/180;
  const M=357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2;
  const L0=280.46645 + 36000.76983*T + 0.0003032*T2;
  const DL=(1.914600-0.004817*T-0.000014*T2)*Math.sin(dr*M)+(0.019993-0.000101*T)*Math.sin(2*dr*M)+0.000290*Math.sin(3*dr*M);
  let L=(L0+DL)*dr; L -= 2*Math.PI*floor(L/(2*Math.PI));
  return floor(L/(Math.PI/6));
}
function lunarMonth11(year) {
  const off=jdFromDate(31,12,year)-2415021, k=floor(off/29.530588853);
  let nm=newMoonDay(k); if (sunLongitude(nm)>=9) nm=newMoonDay(k-1); return nm;
}
function leapMonthOffset(a11) {
  const k=floor((a11-2415021.076998695)/29.530588853+0.5); let last=0, i=1, arc=sunLongitude(newMoonDay(k+i));
  do { last=arc; i++; arc=sunLongitude(newMoonDay(k+i)); } while (arc!==last && i<14);
  return i-1;
}
function solarToLunar(dd,mm,yy) {
  const dayNumber=jdFromDate(dd,mm,yy), k=floor((dayNumber-2415021.076998695)/29.530588853);
  let monthStart=newMoonDay(k+1); if (monthStart>dayNumber) monthStart=newMoonDay(k);
  let a11=lunarMonth11(yy), b11=a11, lunarYear;
  if (a11>=monthStart) { lunarYear=yy; a11=lunarMonth11(yy-1); } else { lunarYear=yy+1; b11=lunarMonth11(yy+1); }
  const lunarDay=dayNumber-monthStart+1, diff=floor((monthStart-a11)/29);
  let lunarLeap=0, lunarMonth=diff+11;
  if (b11-a11>365) { const leapDiff=leapMonthOffset(a11); if (diff>=leapDiff) { lunarMonth=diff+10; if (diff===leapDiff) lunarLeap=1; } }
  if (lunarMonth>12) lunarMonth-=12;
  if (lunarMonth>=11 && diff<4) lunarYear--;
  return {day:lunarDay,month:lunarMonth,year:lunarYear,leap:lunarLeap};
}
function lunarToSolar(day,month,year,leap) {
  let a11,b11;
  if (month<11) { a11=lunarMonth11(year-1); b11=lunarMonth11(year); }
  else { a11=lunarMonth11(year); b11=lunarMonth11(year+1); }
  let off=month-11; if(off<0) off+=12;
  if(b11-a11>365) {
    const leapOff=leapMonthOffset(a11); let leapMonth=leapOff-2; if(leapMonth<0) leapMonth+=12;
    if(leap && month!==leapMonth) return null;
    if(leap || off>=leapOff) off++;
  } else if(leap) return null;
  const k=floor(0.5+(a11-2415021.076998695)/29.530588853), monthStart=newMoonDay(k+off);
  const result=jdToDate(monthStart+day-1);
  if (solarToLunar(result[0],result[1],result[2]).day!==day || solarToLunar(result[0],result[1],result[2]).month!==month || solarToLunar(result[0],result[1],result[2]).year!==year || solarToLunar(result[0],result[1],result[2]).leap!==(leap?1:0)) return null;
  return {day:result[0],month:result[1],year:result[2]};
}
const pad = n => String(n).padStart(2,"0");

// Traditional Vietnamese Tử Vi: locate Mệnh/Thân from lunar month and birth hour.
// Branch indices follow Tý, Sửu, Dần...; increasing index is the clockwise direction.
const BRANCHES = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
const PALACES = ["Mệnh","Huynh Đệ","Phu Thê","Tử Tức","Tài Bạch","Tật Ách","Thiên Di","Nô Bộc","Quan Lộc","Điền Trạch","Phúc Đức","Phụ Mẫu"];
const HOUR_INDEX = Object.fromEntries(BRANCHES.map((b,i)=>[b,i]));
const mod12 = n => ((n % 12) + 12) % 12;
function locateMenhThan(lunarMonth, hourBranch) {
  const hour = HOUR_INDEX[hourBranch];
  const monthPalace = mod12(2 + lunarMonth - 1); // Dần is month 1
  return { menh: mod12(monthPalace - hour), than: mod12(monthPalace + hour) };
}
function arrangePalaces(menhIndex) {
  // From Mệnh, count counter-clockwise: Huynh Đệ, Phu Thê... Phụ Mẫu.
  return PALACES.map((palace, i) => ({ palace, branch: BRANCHES[mod12(menhIndex - i)] }));
}
const birthForm=document.getElementById("birthForm"), formResult=document.getElementById("formResult");
const solarFields=document.getElementById("solarFields"), lunarFields=document.getElementById("lunarFields");
const calendarChoices=document.querySelectorAll('input[name="calendarType"]');
const solarDate=birthForm?.elements.namedItem("solarDate"), lunarDay=birthForm?.elements.namedItem("lunarDay"), lunarMonth=birthForm?.elements.namedItem("lunarMonth"), lunarYear=birthForm?.elements.namedItem("lunarYear");
function selectedCalendar(){return birthForm?.querySelector('input[name="calendarType"]:checked')?.value||"solar";}
function updateCalendarFields(){const isSolar=selectedCalendar()==="solar"; solarFields.hidden=!isSolar; lunarFields.hidden=isSolar; solarDate.required=isSolar; lunarDay.required=!isSolar; lunarMonth.required=!isSolar; lunarYear.required=!isSolar; formResult.textContent="";}
calendarChoices.forEach(choice=>choice.addEventListener("change",updateCalendarFields)); updateCalendarFields();

birthForm?.addEventListener("submit",event=>{
  event.preventDefault(); const fd=new FormData(birthForm);
  const name=String(fd.get("name")||"").trim(), calendar=String(fd.get("calendarType")||"solar"), time=String(fd.get("birthtime")||""), gender=String(fd.get("gender")||""), birthplace=String(fd.get("birthplace")||"").trim();
  if(!time||!gender||!birthplace||!fd.get("consent")){formResult.textContent="Vui lòng hoàn tất giờ sinh, giới tính, nơi sinh và xác nhận đồng ý.";return;}
  let solar, lunar;
  if(calendar==="solar"){
    const raw=String(fd.get("solarDate")||""); if(!raw){formResult.textContent="Vui lòng nhập ngày sinh dương lịch.";return;}
    const [y,m,d]=raw.split("-").map(Number); const check=new Date(Date.UTC(y,m-1,d));
    if(check.getUTCFullYear()!==y||check.getUTCMonth()!==m-1||check.getUTCDate()!==d||y<1800||y>2199){formResult.textContent="Ngày dương lịch không hợp lệ hoặc nằm ngoài phạm vi hỗ trợ (1800–2199).";return;}
    solar={day:d,month:m,year:y}; lunar=solarToLunar(d,m,y);
  } else {
    const d=Number(fd.get("lunarDay")),m=Number(fd.get("lunarMonth")),y=Number(fd.get("lunarYear")),leap=Boolean(fd.get("isLeapMonth"));
    if(!d||!m||!y||y<1800||y>2199||d<1||d>30||m<1||m>12){formResult.textContent="Vui lòng nhập ngày âm lịch trong phạm vi hỗ trợ (1800–2199).";return;}
    solar=lunarToSolar(d,m,y,leap); if(!solar){formResult.textContent="Ngày âm lịch này không tồn tại theo lịch Việt Nam UTC+7. Vui lòng kiểm tra ngày, tháng hoặc lựa chọn tháng nhuận.";return;}
    lunar={day:d,month:m,year:y,leap:leap?1:0};
  }
  const leapText=lunar.leap?" (tháng nhuận)":"";
  const title=name?` của ${name}`:"";
  const positions=locateMenhThan(lunar.month,time);
  const palaceRows=arrangePalaces(positions.menh);
  const palaceText=palaceRows.map((item,i)=>`${String(i+1).padStart(2,"0")}. ${item.palace}: ${item.branch}${positions.than===BRANCHES.indexOf(item.branch)?"  ·  (đóng Thân)":""}`).join("\n");
  formResult.textContent=`ĐÃ XÁC NHẬN DỮ LIỆU${title}\nDương lịch: ${pad(solar.day)}/${pad(solar.month)}/${solar.year}\nÂm lịch: ${lunar.day}/${lunar.month}/${lunar.year}${leapText}\nGiờ sinh: ${time} · ${gender} · Nơi sinh: ${birthplace}\n\nKẾT QUẢ V5 — AN MỆNH, AN THÂN\nCung Mệnh: ${BRANCHES[positions.menh]}\nCung Thân: ${BRANCHES[positions.than]}\n\nBỐ CỤC 12 CUNG\n${palaceText}\n\nQuy tắc: lấy Dần làm tháng Giêng; từ cung tháng sinh, đếm nghịch theo giờ để an Mệnh, đếm thuận theo giờ để an Thân. Từ Mệnh, an 11 cung còn lại theo chiều nghịch. Đây là bước an cung cơ bản; chưa an Can cung, Ngũ hành Cục, chính tinh hoặc phụ tinh.`;
});
