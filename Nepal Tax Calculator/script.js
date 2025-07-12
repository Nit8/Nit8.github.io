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
    
    // Get allowance percentages
    const oddShiftPercent = parseFloat(document.getElementById('oddShiftAllowances').value) || 0;
    const overtimePercent = parseFloat(document.getElementById('overtimeAllowance').value) || 0;
    const transportAmount = parseFloat(document.getElementById('transportAllowance').value) || 0;
    const medicalPercent = parseFloat(document.getElementById('medicalAllowance').value) || 0;
    const foodPercent = parseFloat(document.getElementById('foodAllowance').value) || 0;
    const housingPercent = parseFloat(document.getElementById('housingAllowance').value) || 0;
    const otherAllowancesPercent = parseFloat(document.getElementById('otherAllowances').value) || 0;
    
    // Investment and deduction inputs
    const citInvestment = parseFloat(document.getElementById('citInvestment').value) || 0;
    const insurancePremium = parseFloat(document.getElementById('insurancePremium').value) || 0;
    const pfPercent = parseFloat(document.getElementById('pfContribution').value) || 0;
    const healthInsurance = parseFloat(document.getElementById('healthInsurance').value) || 0;
    const educationExpense = parseFloat(document.getElementById('educationExpense').value) || 0;
    const donation = parseFloat(document.getElementById('donation').value) || 0;

    // Calculate allowances
    const oddShiftAmount = (basicSalary * oddShiftPercent) / 100;
    const overtimeAmount = (basicSalary * overtimePercent) / 100;
    const medicalAmount = (basicSalary * medicalPercent) / 100;
    const foodAmount = (basicSalary * foodPercent) / 100;
    const housingAmount = (basicSalary * housingPercent) / 100;
    const otherAllowancesAmount = (basicSalary * otherAllowancesPercent) / 100;
    
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
    const maxCitDeduction = Math.min(citInvestment, totalGrossIncome / 3, 500000);
    const insuranceDeduction = Math.min(insurancePremium, 40000);
    const healthDeduction = Math.min(healthInsurance, 20000);
    const educationDeduction = Math.min(educationExpense, 100000);
    const pfDeduction = (annualBasicSalary * pfPercent) / 100;
    
    // SSF deduction is employee contribution (11%)
    const ssfDeduction = ssfEmployeeContributionAnnual;
    const ssfTotalContribution = ssfEmployerContributionAnnual + ssfEmployeeContributionAnnual;
    
    // Total deductions before donation
    const deductionsBeforeDonation = maxCitDeduction + ssfDeduction + insuranceDeduction + 
                                    pfDeduction + healthDeduction + educationDeduction;
    
    // Calculate taxable income before donation
    const taxableBeforeDonation = Math.max(0, totalGrossIncome - deductionsBeforeDonation);
    
    // Donation deduction (max 5% of taxable income)
    const donationDeduction = Math.min(donation, taxableBeforeDonation * 0.05);
    
    const totalDeductions = deductionsBeforeDonation + donationDeduction;

    // Calculate final taxable income
    const taxableIncome = Math.max(0, totalGrossIncome - totalDeductions);

    // Tax calculation based on FY 2080/81 rules
    let taxLiability = 0;
    const taxFreeLimit = maritalStatus === 'married' ? 600000 : 500000;

    if (taxableIncome > taxFreeLimit) {
        const taxableAmount = taxableIncome - taxFreeLimit;
        
        // Updated tax slabs for FY 2080/81
        if (taxableAmount <= 100000) {
            taxLiability = taxableAmount * 0.01; // 1% for first 1 lakh
        } else if (taxableAmount <= 300000) {
            taxLiability = 1000 + (taxableAmount - 100000) * 0.10; // 10% for next 2 lakh
        } else if (taxableAmount <= 500000) {
            taxLiability = 1000 + 20000 + (taxableAmount - 300000) * 0.20; // 20% for next 2 lakh
        } else if (taxableAmount <= 2000000) {
            taxLiability = 1000 + 20000 + 40000 + (taxableAmount - 500000) * 0.30; // 30% for next 15 lakh
        } else {
            taxLiability = 1000 + 20000 + 40000 + 450000 + (taxableAmount - 2000000) * 0.36; // 36% above 20 lakh
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
    document.getElementById('taxLiability').textContent = `NPR ${taxLiability.toLocaleString()}`;
    
    document.getElementById('citDeduction').textContent = `NPR ${maxCitDeduction.toLocaleString()}`;
    document.getElementById('ssfContribution').textContent = `NPR ${ssfTotalContribution.toLocaleString()}`;
    document.getElementById('insuranceDeduction').textContent = `NPR ${insuranceDeduction.toLocaleString()}`;
    document.getElementById('pfDeduction').textContent = `NPR ${pfDeduction.toLocaleString()}`;
    document.getElementById('healthDeduction').textContent = `NPR ${healthDeduction.toLocaleString()}`;
    document.getElementById('educationDeduction').textContent = `NPR ${educationDeduction.toLocaleString()}`;
    document.getElementById('donationDeduction').textContent = `NPR ${donationDeduction.toLocaleString()}`;
    document.getElementById('totalDeductions').textContent = `NPR ${totalDeductions.toLocaleString()}`;

    // Calculate monthly take-home pay
    const monthlyTakeHome = (totalGrossIncome - taxLiability - ssfEmployeeContributionAnnual - (pfDeduction + citInvestment)) / 12;
    const monthlySavings = (maxCitDeduction + insuranceDeduction + healthDeduction + educationDeduction) / 12;
    const taxEfficiency = totalGrossIncome > 0 ? (taxSaved / totalGrossIncome) * 100 : 0;
    const savingsRate = totalGrossIncome > 0 ? (totalDeductions / totalGrossIncome) * 100 : 0;

    document.getElementById('monthlyTakeHome').textContent = `NPR ${monthlyTakeHome.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    document.getElementById('monthlySavings').textContent = `NPR ${monthlySavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    document.getElementById('taxSaved').textContent = `NPR ${taxSaved.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    document.getElementById('efficiencyPercent').textContent = `${taxEfficiency.toFixed(1)}%`;
    document.getElementById('savingsPercent').textContent = `${savingsRate.toFixed(1)}%`;

    // Update progress bars
    document.getElementById('efficiencyProgress').style.width = `${Math.min(taxEfficiency, 100)}%`;
    document.getElementById('savingsProgress').style.width = `${Math.min(savingsRate, 100)}%`;

    // Generate recommendations
    generateRecommendations(totalGrossIncome, maxCitDeduction, ssfDeduction, insuranceDeduction, 
                            taxLiability, totalAnnualAllowances, healthDeduction, 
                            educationDeduction, donationDeduction);

    // Add animation
    document.querySelectorAll('.result-card').forEach(card => {
        card.classList.add('animation-fade-in');
    });
}

function generateRecommendations(totalIncome, citDeduction, ssfDeduction, insuranceDeduction, taxLiability, totalAllowances, healthDeduction, educationDeduction, donationDeduction) {
    const recommendations = [];
    const taxableIncome = totalIncome - (citDeduction + ssfDeduction + insuranceDeduction + healthDeduction + educationDeduction + donationDeduction);
    
    // Tax-free limit based on marital status
    const taxFreeLimit = 500000; // Assuming single for recommendations
    const shouldSuggestInvestments = taxLiability > 0 && taxableIncome > taxFreeLimit;

    // CIT Recommendation
    const maxCitAllowed = Math.min(totalIncome / 3, 500000);
    if (citDeduction < maxCitAllowed && shouldSuggestInvestments) {
        const additional = Math.min(maxCitAllowed - citDeduction, taxableIncome - taxFreeLimit);
        if (additional > 10000) {
            recommendations.push(`CIT Optimization: Invest NPR ${Math.round(additional).toLocaleString()} more to save taxes`);
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