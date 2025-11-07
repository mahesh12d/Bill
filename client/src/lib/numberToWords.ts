const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

function convertLessThanThousand(num: number): string {
  if (num === 0) return '';
  
  let result = '';
  
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  
  if (num >= 20) {
    result += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  } else if (num >= 10) {
    result += teens[num - 10] + ' ';
    return result.trim();
  }
  
  if (num > 0) {
    result += ones[num] + ' ';
  }
  
  return result.trim();
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  let result = '';
  
  if (rupees >= 10000000) {
    const crores = Math.floor(rupees / 10000000);
    result += convertLessThanThousand(crores) + ' Crore ';
    const remainder = rupees % 10000000;
    if (remainder > 0) {
      if (remainder >= 100000) {
        const lakhs = Math.floor(remainder / 100000);
        result += convertLessThanThousand(lakhs) + ' Lakh ';
        const thousands = remainder % 100000;
        if (thousands >= 1000) {
          result += convertLessThanThousand(Math.floor(thousands / 1000)) + ' Thousand ';
          const hundreds = thousands % 1000;
          if (hundreds > 0) {
            result += convertLessThanThousand(hundreds) + ' ';
          }
        } else if (thousands > 0) {
          result += convertLessThanThousand(thousands) + ' ';
        }
      } else if (remainder >= 1000) {
        result += convertLessThanThousand(Math.floor(remainder / 1000)) + ' Thousand ';
        const hundreds = remainder % 1000;
        if (hundreds > 0) {
          result += convertLessThanThousand(hundreds) + ' ';
        }
      } else {
        result += convertLessThanThousand(remainder) + ' ';
      }
    }
  } else if (rupees >= 100000) {
    const lakhs = Math.floor(rupees / 100000);
    result += convertLessThanThousand(lakhs) + ' Lakh ';
    const remainder = rupees % 100000;
    if (remainder >= 1000) {
      result += convertLessThanThousand(Math.floor(remainder / 1000)) + ' Thousand ';
      const hundreds = remainder % 1000;
      if (hundreds > 0) {
        result += convertLessThanThousand(hundreds) + ' ';
      }
    } else if (remainder > 0) {
      result += convertLessThanThousand(remainder) + ' ';
    }
  } else if (rupees >= 1000) {
    result += convertLessThanThousand(Math.floor(rupees / 1000)) + ' Thousand ';
    const remainder = rupees % 1000;
    if (remainder > 0) {
      result += convertLessThanThousand(remainder) + ' ';
    }
  } else {
    result += convertLessThanThousand(rupees) + ' ';
  }
  
  result += 'Rupees';
  
  if (paise > 0) {
    result += ' and ' + convertLessThanThousand(paise) + ' Paise';
  }
  
  result += ' Only';
  
  return result.trim();
}
