// Nepal Tax Calculator Script
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
    
    // Get allowance percentages
    const oddShiftPercent = parseFloat(document.getElementById('oddShiftAllowances').value) || 0;
    const overtimePercent = parseFloat(document.getElementById('overtimeAllowance').value) || 0;
    // const transportPercent = parseFloat(document.getElementById('transportAllowance').value) || 0;
    const transportAmount = parseFloat(document.getElementById('transportAllowance').value) || 0;
    const medicalPercent = parseFloat(document.getElementById('medicalAllowance').value) || 0;
    const foodPercent = parseFloat(document.getElementById('foodAllowance').value) || 0;
    const housingPercent = parseFloat(document.getElementById('housingAllowance').value) || 0;
    const otherAllowancesPercent = parseFloat(document.getElementById('otherAllowances').value) || 0;
    
    // Investment and deduction inputs
    const citInvestment = parseFloat(document.getElementById('citInvestment').value) || 0;
    const ssfPercent = parseFloat(document.getElementById('ssfContribution').value) || 0;
    const insurancePremium = parseFloat(document.getElementById('insurancePremium').value) || 0;
    const pfPercent = parseFloat(document.getElementById('pfContribution').value) || 0;
    const healthInsurance = parseFloat(document.getElementById('healthInsurance').value) || 0;
    const educationExpense = parseFloat(document.getElementById('educationExpense').value) || 0;
    const donation = parseFloat(document.getElementById('donation').value) || 0;

    // Calculate allowances
    const oddShiftAmount = (basicSalary * oddShiftPercent) / 100;
    const overtimeAmount = (basicSalary * overtimePercent) / 100;
    // const transportAmount = (basicSalary * transportPercent) / 100;
    const medicalAmount = (basicSalary * medicalPercent) / 100;
    const foodAmount = (basicSalary * foodPercent) / 100;
    const housingAmount = (basicSalary * housingPercent) / 100;
    const otherAllowancesAmount = (basicSalary * otherAllowancesPercent) / 100;
    
    const totalMonthlyAllowances = oddShiftAmount + overtimeAmount + transportAmount + 
                                medicalAmount + foodAmount + housingAmount + otherAllowancesAmount;
    const totalAnnualAllowances = totalMonthlyAllowances * 12;

    // Calculate total income (employee perspective)
    const annualBasicSalary = basicSalary * 12;
    const bonusAmount = basicSalary * festivalBonus;
    const totalIncome = annualBasicSalary + bonusAmount + totalAnnualAllowances + otherIncome;

    // SSF Calculation (FY 2081/82 rules)
    // Employee contributes 11% (tax deductible up to 10% of basic salary)
    // Employer contributes 20% (NOT part of employee's taxable income)
    const maxMonthlyBasicForSSF = 100000; // Max basic salary considered for SSF
    const cappedBasicForSSF = Math.min(basicSalary, maxMonthlyBasicForSSF);
    const employeeSSFContribution = (cappedBasicForSSF * ssfPercent / 100) * 12;
    const maxSSFDeduction = Math.min(cappedBasicForSSF * 0.10 * 12, 120000);
    const ssfDeduction = Math.min(employeeSSFContribution, maxSSFDeduction);

    // Other deductions with limits
    const maxCitDeduction = Math.min(citInvestment, totalIncome / 3, 500000);
    const insuranceDeduction = Math.min(insurancePremium, 40000);
    const healthDeduction = Math.min(healthInsurance, 20000);
    const educationDeduction = Math.min(educationExpense, 100000);
    const pfDeduction = (annualBasicSalary * pfPercent) / 100;
    
    // Donation deduction (max 5% of taxable income)
    const deductionsBeforeDonation = maxCitDeduction + ssfDeduction + insuranceDeduction + 
                                    pfDeduction + healthDeduction + educationDeduction;
    const taxableBeforeDonation = Math.max(0, totalIncome - deductionsBeforeDonation);
    const donationDeduction = Math.min(donation, taxableBeforeDonation * 0.05);
    
    const totalDeductions = deductionsBeforeDonation + donationDeduction;

    // Calculate taxable income
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);

    // Tax calculation based on Nepal tax slabs 2081/2082
    let taxLiability = 0;
    const taxFreeLimit = maritalStatus === 'married' ? 600000 : 500000;

    if (taxableIncome > taxFreeLimit) {
        const taxableAmount = taxableIncome - taxFreeLimit;
        
        if (taxableAmount <= 200000) {
            taxLiability = taxableAmount * 0.1;
        } else if (taxableAmount <= 500000) {
            taxLiability = 20000 + (taxableAmount - 200000) * 0.2;
        } else if (taxableAmount <= 2000000) {
            taxLiability = 20000 + 60000 + (taxableAmount - 500000) * 0.3;
        } else {
            taxLiability = 20000 + 60000 + 450000 + (taxableAmount - 2000000) * 0.36;
        }
    }

    // Calculate potential tax without deductions
    const taxableIncomeWithoutDeductions = totalIncome;
    let potentialTax = 0;
    if (taxableIncomeWithoutDeductions > taxFreeLimit) {
        const taxableAmount = taxableIncomeWithoutDeductions - taxFreeLimit;
        if (taxableAmount <= 200000) {
            potentialTax = taxableAmount * 0.1;
        } else if (taxableAmount <= 500000) {
            potentialTax = 20000 + (taxableAmount - 200000) * 0.2;
        } else if (taxableAmount <= 2000000) {
            potentialTax = 20000 + 60000 + (taxableAmount - 500000) * 0.3;
        } else {
            potentialTax = 20000 + 60000 + 450000 + (taxableAmount - 2000000) * 0.36;
        }
    }

    const taxSaved = potentialTax - taxLiability;

    // Update Income Breakdown
    document.getElementById('basicSalaryAmount').textContent = `NPR ${annualBasicSalary.toLocaleString()}`;
    document.getElementById('bonusAmount').textContent = `NPR ${bonusAmount.toLocaleString()}`;
    document.getElementById('totalAllowances').textContent = `NPR ${totalAnnualAllowances.toLocaleString()}`;
    document.getElementById('otherIncomeAmount').textContent = `NPR ${otherIncome.toLocaleString()}`;
    document.getElementById('grossIncome').textContent = `NPR ${totalIncome.toLocaleString()}`;

    // Update UI
    document.getElementById('totalIncome').textContent = `NPR ${totalIncome.toLocaleString()}`;
    document.getElementById('taxableIncome').textContent = `NPR ${taxableIncome.toLocaleString()}`;
    document.getElementById('taxLiability').textContent = `NPR ${taxLiability.toLocaleString()}`;
    
    document.getElementById('citDeduction').textContent = `NPR ${maxCitDeduction.toLocaleString()}`;
    document.getElementById('ssfDeduction').textContent = `NPR ${ssfDeduction.toLocaleString()}`;
    document.getElementById('insuranceDeduction').textContent = `NPR ${insuranceDeduction.toLocaleString()}`;
    document.getElementById('pfDeduction').textContent = `NPR ${pfDeduction.toLocaleString()}`;
    document.getElementById('healthDeduction').textContent = `NPR ${healthDeduction.toLocaleString()}`;
    document.getElementById('educationDeduction').textContent = `NPR ${educationDeduction.toLocaleString()}`;
    document.getElementById('donationDeduction').textContent = `NPR ${donationDeduction.toLocaleString()}`;
    document.getElementById('totalDeductions').textContent = `NPR ${totalDeductions.toLocaleString()}`;

    // Calculate metrics
    const actualSSFContribution = (cappedBasicForSSF * ssfPercent / 100) * 12;
    const monthlyTakeHome = (totalIncome - taxLiability - (actualSSFContribution + pfDeduction)) / 12;
    const monthlySavings = (maxCitDeduction + insuranceDeduction + healthDeduction + educationDeduction) / 12;
    const taxEfficiency = totalIncome > 0 ? (taxSaved / totalIncome) * 100 : 0;
    const savingsRate = totalIncome > 0 ? (totalDeductions / totalIncome) * 100 : 0;

    document.getElementById('monthlyTakeHome').textContent = `NPR ${monthlyTakeHome.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    document.getElementById('monthlySavings').textContent = `NPR ${monthlySavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    document.getElementById('taxSaved').textContent = `NPR ${taxSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    document.getElementById('efficiencyPercent').textContent = `${taxEfficiency.toFixed(1)}%`;
    document.getElementById('savingsPercent').textContent = `${savingsRate.toFixed(1)}%`;

    // Update progress bars
    document.getElementById('efficiencyProgress').style.width = `${Math.min(taxEfficiency, 100)}%`;
    document.getElementById('savingsProgress').style.width = `${Math.min(savingsRate, 100)}%`;

    // Generate recommendations
    generateRecommendations(totalIncome, maxCitDeduction, ssfDeduction, insuranceDeduction, 
                            taxLiability, totalAnnualAllowances, healthDeduction, 
                            educationDeduction, donationDeduction);

    // Add animation
    document.querySelectorAll('.result-card').forEach(card => {
        card.classList.add('animation-fade-in');
    });
}

function generateRecommendations(totalIncome, citDeduction, ssfDeduction, insuranceDeduction, taxLiability, totalAllowances, healthDeduction, educationDeduction, donationDeduction) {
    const recommendations = [];
    const taxableIncome = totalIncome - (citDeduction + ssfDeduction + insuranceDeduction + healthDeduction + educationDeduction + donationDeduction) + totalAllowances;
    
    // Only suggest investments if user has tax liability AND taxable income > threshold
    const taxFreeLimit = totalAllowances > 0 ? 600000 : 500000;
    const shouldSuggestInvestments = taxLiability > 0 && taxableIncome > taxFreeLimit;

    // SSF Recommendation
    const maxMonthlyBasicForSSF = 100000;
    const maxSSFDeduction = Math.min(maxMonthlyBasicForSSF * 0.10 * 12, 120000);
    if (ssfDeduction < maxSSFDeduction && shouldSuggestInvestments) {
        const additional = Math.min(maxSSFDeduction - ssfDeduction, taxableIncome - taxFreeLimit);
        if (additional > 10000) {
            recommendations.push(`Maximize SSF: Increase contribution by NPR ${Math.round(additional).toLocaleString()} (10% of basic salary up to NPR 1.2L/month)`);
        }
    }

    // CIT Recommendation (only if beneficial)
    const maxCitAllowed = Math.min(totalIncome / 3, 500000);
    if (citDeduction < maxCitAllowed && shouldSuggestInvestments) {
        const additional = Math.min(maxCitAllowed - citDeduction, taxableIncome - taxFreeLimit);
        if (additional > 10000) {
            recommendations.push(`CIT Optimization: Invest NPR ${Math.round(additional).toLocaleString()} more to save taxes`);
        }
    }
    
    // Other recommendations only if tax liability exists
    if (shouldSuggestInvestments) {
        if (insuranceDeduction < 40000) {
            const additional = 40000 - insuranceDeduction;
            recommendations.push(`Life Insurance: Top-up by NPR ${additional.toLocaleString()} (Max: 40k/year)`);
        }
        if (healthDeduction < 20000) {
            const additional = 20000 - healthDeduction;
            recommendations.push(`Health Insurance: Add coverage for NPR ${additional.toLocaleString()} (Max: 20k/year)`);
        }
        if (educationDeduction < 100000) {
            const additional = 100000 - educationDeduction;
            recommendations.push(`Education Fund: Invest NPR ${additional.toLocaleString()} more for tax-free growth`);
        }
        const maxDonation = totalIncome * 0.05;
        if (donationDeduction < maxDonation) {
            recommendations.push(`Charitable Donations: Contribute up to NPR ${Math.round(maxDonation).toLocaleString()} (5% of income) for deduction`);
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