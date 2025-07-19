// Nepal Tax Calculator Script - Updated for FY 2080/81 Rules
// Initialize tooltips
document.querySelectorAll('.info-icon').forEach(icon => {
    icon.addEventListener('mouseover', function() {
        this.querySelector('.tooltip').style.display = 'block';
    });
    
    icon.addEventListener('mouseout', function() {
        this.querySelector('.tooltip').style.display = 'none';
    });
});

function calculateTax() {
    // Get input values
    const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
    const festivalBonus = parseFloat(document.getElementById('festivalBonus').value) || 1;
    const otherIncome = parseFloat(document.getElementById('otherIncome').value) || 0;
    const maritalStatus = document.getElementById('maritalStatus').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || '';
    
    // Get allowance percentages
    const oddShiftPercent = parseFloat(document.getElementById('oddShiftAllowances').value) || 0;
    const overtimePercent = parseFloat(document.getElementById('overtimeAllowance').value) || 0;
    const transportAmount = parseFloat(document.getElementById('transportAllowance').value) || 0;
    // const medicalPercent = parseFloat(document.getElementById('medicalAllowance').value) || 0;
    // const foodPercent = parseFloat(document.getElementById('foodAllowance').value) || 0;
    // const housingPercent = parseFloat(document.getElementById('housingAllowance').value) || 0;
    // const otherAllowancesPercent = parseFloat(document.getElementById('otherAllowances').value) || 0;
    const medicalAmount = parseFloat(document.getElementById('medicalAllowance').value) || 0;
    const foodAmount = parseFloat(document.getElementById('foodAllowance').value) || 0;
    const housingAmount = parseFloat(document.getElementById('housingAllowance').value) || 0;
    const otherAllowancesAmount = parseFloat(document.getElementById('otherAllowances').value) || 0;
    
    // Investment and deduction inputs
    let citInvestment = parseFloat(document.getElementById('citInvestment').value) || 0;
    let citType = document.getElementById('citInvestmentType').value;
    if (citType === 'monthly') {
        citInvestment *= 12;  // Convert monthly to annual
    }
    const insurancePremium = parseFloat(document.getElementById('insurancePremium').value) || 0;
    const pfPercent = parseFloat(document.getElementById('pfContribution').value) || 0;
    const healthInsurance = parseFloat(document.getElementById('healthInsurance').value) || 0;
    // const educationExpense = parseFloat(document.getElementById('educationExpense').value) || 0;
    const donation = parseFloat(document.getElementById('donation').value) || 0;

    // Calculate allowances
    const oddShiftAmount = (basicSalary * oddShiftPercent) / 100;
    const overtimeAmount = (basicSalary * overtimePercent) / 100;

    // const medicalAmount = (basicSalary * medicalPercent) / 100;
    // const foodAmount = (basicSalary * foodPercent) / 100;
    // const housingAmount = (basicSalary * housingPercent) / 100;
    // const otherAllowancesAmount = (basicSalary * otherAllowancesPercent) / 100;
    
    const totalMonthlyAllowances = oddShiftAmount + overtimeAmount + transportAmount + 
                                medicalAmount + foodAmount + housingAmount + otherAllowancesAmount;
    const totalAnnualAllowances = totalMonthlyAllowances * 12;

    // SSF Calculation - Updated for FY 2080/81
    // Employee contributes 11% of basic salary (tax deductible)
    // Employer contributes 20% of basic salary (INCLUDED in gross salary for tax purposes)
    const ssfEmployeeContributionMonthly = basicSalary * 0.11;
    const ssfEmployeeContributionAnnual = ssfEmployeeContributionMonthly * 12;
    const ssfEmployerContributionMonthly = basicSalary * 0.20;
    const ssfEmployerContributionAnnual = ssfEmployerContributionMonthly * 12;

    // Calculate total gross income (includes employer SSF contribution)
    const annualBasicSalary = basicSalary * 12;
    const bonusAmount = basicSalary * festivalBonus;
    const totalGrossIncome = annualBasicSalary + bonusAmount + totalAnnualAllowances + 
                           ssfEmployerContributionAnnual + otherIncome;

    // Calculate deductions
    // const maxCombinedDeduction = Math.min(citInvestment, totalGrossIncome / 3, 500000);
    const insuranceDeduction = Math.min(insurancePremium, 40000);
    const healthDeduction = Math.min(healthInsurance, 20000);
    // const educationDeduction = Math.min(educationExpense, 100000);
    const pfDeduction = (annualBasicSalary * pfPercent) / 100;
    
    // SSF deduction is employee contribution (11%)
    const ssfDeduction = ssfEmployeeContributionAnnual;
    const ssfTotalContribution = ssfEmployerContributionAnnual + ssfEmployeeContributionAnnual;
    const maxCombinedDeduction = Math.min(citInvestment+ssfTotalContribution+pfDeduction, totalGrossIncome / 3, 500000);
    const actualCITSSFPFInvested = citInvestment+ssfTotalContribution+pfDeduction;
    
    // Total deductions before donation
    const deductionsBeforeDonation = maxCombinedDeduction + insuranceDeduction + healthDeduction;
    
    // Calculate taxable income before donation
    const taxableBeforeDonation = Math.max(0, totalGrossIncome - deductionsBeforeDonation);
    
    // Donation deduction (max 5% of taxable income)
    const donationDeduction = Math.min(donation, taxableBeforeDonation * 0.05);
    
    const totalDeductions = deductionsBeforeDonation + donationDeduction;

    // Calculate final taxable income
    const taxableIncome = Math.max(0, totalGrossIncome - totalDeductions);

    // Tax calculation based on FY 2080/81 rules
    const taxFreeLimit = maritalStatus === 'married' ? 600000 : 500000;
    let taxLiability = 0;
    const isSSFOrPensionEnrolled = (ssfDeduction > 0 || pfDeduction > 0);
    if (taxableIncome > taxFreeLimit) {
        let remaining = taxableIncome - taxFreeLimit;
        if (remaining <= 200000) {
            taxLiability = remaining * 0.10;
        } else if (remaining <= 500000) {
            taxLiability = 200000 * 0.10 + (remaining - 200000) * 0.20;
        } else if (remaining <= 1500000) {
            taxLiability = 200000 * 0.10 + 300000 * 0.20 + (remaining - 500000) * 0.30;
        } else if (remaining <= 4500000) {
            taxLiability = 200000 * 0.10 + 300000 * 0.20 + 1000000 * 0.30 + (remaining - 1500000) * 0.36;
        } else {
            taxLiability = 200000 * 0.10 + 300000 * 0.20 + 1000000 * 0.30 + 3000000 * 0.36 + (remaining - 4500000) * 0.39;
        }
        // Add 1% on the first slab if NOT SSF or pension income
        if (!isSSFOrPensionEnrolled) {
            taxLiability += taxFreeLimit * 0.01;
        }
        if (gender == 'female'){
            taxLiability -= taxLiability * 0.1; // 10% discount
        }
    }

    // Calculate potential tax without deductions
    const taxableIncomeWithoutDeductions = totalGrossIncome;
    let potentialTax = 0;
    if (taxableIncomeWithoutDeductions > taxFreeLimit) {
        const taxableAmount = taxableIncomeWithoutDeductions - taxFreeLimit;
        if (taxableAmount <= 100000) {
            potentialTax = taxableAmount * 0.01;
        } else if (taxableAmount <= 300000) {
            potentialTax = 1000 + (taxableAmount - 100000) * 0.10;
        } else if (taxableAmount <= 500000) {
            potentialTax = 1000 + 20000 + (taxableAmount - 300000) * 0.20;
        } else if (taxableAmount <= 2000000) {
            potentialTax = 1000 + 20000 + 40000 + (taxableAmount - 500000) * 0.30;
        } else {
            potentialTax = 1000 + 20000 + 40000 + 450000 + (taxableAmount - 2000000) * 0.36;
        }
    }

    const taxSaved = potentialTax - taxLiability;

    // Update Income Breakdown
    document.getElementById('basicSalaryAmount').textContent = `NPR ${annualBasicSalary.toLocaleString()}`;
    document.getElementById('bonusAmount').textContent = `NPR ${bonusAmount.toLocaleString()}`;
    document.getElementById('totalAllowances').textContent = `NPR ${totalAnnualAllowances.toLocaleString()}`;
    document.getElementById('otherIncomeAmount').textContent = `NPR ${otherIncome.toLocaleString()}`;
    document.getElementById('grossIncome').textContent = `NPR ${totalGrossIncome.toLocaleString()}`;

    // Update UI
    document.getElementById('totalIncome').textContent = `NPR ${totalGrossIncome.toLocaleString()}`;
    document.getElementById('taxableIncome').textContent = `NPR ${taxableIncome.toLocaleString()}`;
    // document.getElementById('taxLiability').textContent = `NPR ${taxLiability.toLocaleString()}`;
    document.getElementById('taxLiabilityAnnual').textContent = `NPR ${taxLiability.toLocaleString()}`;
    document.getElementById('taxLiabilityMonthly').textContent = `NPR ${(taxLiability/12).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    
    document.getElementById('citDeduction').textContent = `NPR ${citInvestment.toLocaleString()}`;
    document.getElementById('citDeductionMonthly').textContent = `NPR ${(citInvestment/12).toLocaleString()}`;
    document.getElementById('ssfContribution').textContent = `NPR ${ssfTotalContribution.toLocaleString()}`;
    document.getElementById('ssfContributionMonthly').textContent = `NPR ${(ssfTotalContribution/12).toLocaleString()}`;
    document.getElementById('insuranceDeduction').textContent = `NPR ${insuranceDeduction.toLocaleString()}`;
    document.getElementById('pfDeduction').textContent = `NPR ${pfDeduction.toLocaleString()}`;
    document.getElementById('pfDeductionMonthly').textContent = `NPR ${(pfDeduction/12).toLocaleString()}`;
    document.getElementById('healthDeduction').textContent = `NPR ${healthDeduction.toLocaleString()}`;
    // document.getElementById('educationDeduction').textContent = `NPR ${educationDeduction.toLocaleString()}`;
    document.getElementById('donationDeduction').textContent = `NPR ${donationDeduction.toLocaleString()}`;
    document.getElementById('totalDeductions').textContent = `NPR ${totalDeductions.toLocaleString()}`;
    document.getElementById('totalDeductionsMonthly').textContent = `NPR ${(totalDeductions/12).toLocaleString()}`;
    
    const annualTakeHome = 
        annualBasicSalary
        + totalAnnualAllowances
        + otherIncome
        - taxLiability
        - ssfEmployeeContributionAnnual
        - pfDeduction
        - citInvestment;

    const monthlyTakeHome = annualTakeHome / 12;
    const monthlySavings = (maxCombinedDeduction + insuranceDeduction + healthDeduction ) / 12;
    const taxEfficiency = totalGrossIncome > 0 ? (taxSaved / totalGrossIncome) * 100 : 0;
    const savingsRate = totalGrossIncome > 0 ? (totalDeductions / totalGrossIncome) * 100 : 0;

    document.getElementById('monthlyTakeHome').innerHTML =
        `NPR ${monthlyTakeHome.toLocaleString('en-IN', {maximumFractionDigits: 0})}<br>+ Festival Bonus: NPR ${bonusAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    document.getElementById('monthlySavings').textContent = `NPR ${monthlySavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    document.getElementById('taxSaved').textContent = `NPR ${taxSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    document.getElementById('efficiencyPercent').textContent = `${taxEfficiency.toFixed(1)}%`;
    document.getElementById('savingsPercent').textContent = `${savingsRate.toFixed(1)}%`;

    // Update progress bars
    document.getElementById('efficiencyProgress').style.width = `${Math.min(taxEfficiency, 100)}%`;
    document.getElementById('savingsProgress').style.width = `${Math.min(savingsRate, 100)}%`;

    // Generate recommendations
    generateRecommendations(
        totalGrossIncome,
        maxCombinedDeduction,
        ssfDeduction,
        insuranceDeduction,
        taxLiability,
        totalAnnualAllowances,
        healthDeduction,
        donationDeduction,
        taxableBeforeDonation,
        actualCITSSFPFInvested
    );

    // Add animation
    document.querySelectorAll('.result-card').forEach(card => {
        card.classList.add('animation-fade-in');
    });
}

function generateRecommendations(
    totalIncome,
    maxCombinedDeduction,
    ssfDeduction,
    insuranceDeduction,
    taxLiability,
    totalAllowances,
    healthDeduction,
    donationDeduction,
    taxableBeforeDonation,
    actualCITSSFPFInvested
) {
    const recommendations = [];
    const taxableIncome = totalIncome - (maxCombinedDeduction + ssfDeduction + insuranceDeduction + healthDeduction + donationDeduction);
    
    // Tax-free limit based on marital status
    const taxFreeLimit = 500000; // Assuming single for recommendations
    const shouldSuggestInvestments = taxLiability > 0 && taxableIncome > taxFreeLimit;

    // CIT Recommendation
    const maxCombinedContributionAllowed = Math.min(totalIncome / 3, 500000);
    if (maxCombinedDeduction < maxCombinedContributionAllowed && shouldSuggestInvestments) {
        const additional = Math.min(maxCombinedContributionAllowed - maxCombinedDeduction, taxableIncome - taxFreeLimit);
        if (additional > 0) {
            recommendations.push(`CIT/PF Optimization: You can invest up to NPR ${Math.round(additional).toLocaleString()} more (combined CIT, PF) for maximum tax benefit`);
        }
    }
    else if (actualCITSSFPFInvested > maxCombinedContributionAllowed && shouldSuggestInvestments) {
        const moreContrib = Math.min(actualCITSSFPFInvested - maxCombinedContributionAllowed);
        if (moreContrib > 0) {
            recommendations.push(`CIT/PF Optimization: You have invested NPR ${Math.round(moreContrib).toLocaleString()} more (combined CIT, PF) that could give maximum tax benefit`);
        }
    }
    
    // SSF Recommendation
    if (shouldSuggestInvestments) {
        recommendations.push(`SSF Contribution: Employee 11% (NPR ${Math.round(ssfDeduction).toLocaleString()}) + Employer 20% already optimized`);
    }

    // Other recommendations
    if (shouldSuggestInvestments) {
        if (insuranceDeduction < 40000) {
            const additional = 40000 - insuranceDeduction;
            recommendations.push(`Life Insurance: Top-up by NPR ${additional.toLocaleString()} (Max: 40k/year)`);
        }
        if (healthDeduction < 20000) {
            const additional = 20000 - healthDeduction;
            recommendations.push(`Health Insurance: Add coverage for NPR ${additional.toLocaleString()} (Max: 20k/year)`);
        }
        const maxDonation = taxableBeforeDonation * 0.05;
        if (donationDeduction < maxDonation) {
            recommendations.push(`Charitable Donations: Contribute up to NPR ${Math.round(maxDonation).toLocaleString()} (5% of taxable income before donation) for deduction`);
        }
    }
    
    // Special cases
    if (taxLiability === 0) {
        recommendations.push("✅ Zero Tax Achieved! Focus on wealth-building investments");
    }
    if (taxableIncome <= taxFreeLimit) {
        recommendations.push("ℹ️ You're below taxable threshold - prioritize liquidity over tax savings");
    }
    if (totalAllowances === 0 && taxableIncome > taxFreeLimit) {
        recommendations.push("💡 Negotiate tax-free allowances with employer (up to 1/3 basic salary)");
    }

    // Default message if no recommendations
    if (recommendations.length === 0) {
        recommendations.push("🎉 Excellent tax optimization! Maintain current strategy");
    }

    // Render to DOM
    const list = document.getElementById('recommendationList');
    list.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.className = rec.startsWith("✅") ? 'success' : 
                    rec.startsWith("ℹ️") ? 'info' : 
                    rec.startsWith("💡") ? 'tip' : 'action';
        li.textContent = rec;
        list.appendChild(li);
    });
}

// Initialize with default calculation
document.addEventListener('DOMContentLoaded', function() {
    calculateTax();
    
    // Add tooltips for info icons
    document.querySelectorAll('.info-icon').forEach(icon => {
        icon.addEventListener('mouseover', function() {
            this.querySelector('.tooltip').style.display = 'block';
        });
        
        icon.addEventListener('mouseout', function() {
            this.querySelector('.tooltip').style.display = 'none';
        });
    });
});

// Auto-calculate on input change
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', calculateTax);
});

// Modal functionality for tax slab details
document.getElementById('openTaxSlab').addEventListener('click', function () {
    document.getElementById('taxSlabModal').style.display = 'block';
});

document.getElementById('closeTaxSlab').addEventListener('click', function () {
    document.getElementById('taxSlabModal').style.display = 'none';
});

// Optional: Close modal when clicking outside content
window.addEventListener('click', function (event) {
    const modal = document.getElementById('taxSlabModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Getting rid of zeros in input fields when editing
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('focus', function () {
        if (this.value === "0") {
          this.value = "";
        }
      });

      input.addEventListener('blur', function () {
        if (this.value.trim() === "") {
          this.value = "0";
        }
      });
    });
  });

  document.getElementById('lastUpdate').textContent = 
  'Last Updated: ' + new Date().toISOString().split('T')[0];