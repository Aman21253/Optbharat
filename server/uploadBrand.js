const { createClient } = require('@supabase/supabase-js');
const sampleBrands = require('./data/sampleBrand');

const supabaseUrl = 'https://kvbxzrblwaanuawqyelm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2Ynh6cmJsd2FhbnVhd3F5ZWxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI5ODc5NiwiZXhwIjoyMDY3ODc0Nzk2fQ.tSbjrTpklP_8b_zbqgKOnMIMBY0je4Hv-MOV-pJ5B0E';
const supabase = createClient(supabaseUrl, supabaseKey);

const upload = async () => {
    const transformedBrands = sampleBrands.map(brand => ({
      name: brand.name,
      product_category: brand.productCategory,
      global_brand: brand.country_of_origin !== 'India',
      description: brand.description,
      country_of_origin: brand.countryOfOrigin,
      country_of_operation: brand.countryOfOperations || "India",
      positioning: brand.tags?.join(', ') || null,
      approved: true
    }));
  
    const { data, error } = await supabase
      .from('brands')
      .insert(transformedBrands);
  
    if (error) {
      console.error('❌ Upload failed:', error.message);
      console.error('🧾 Full error object:', error);
    } else {
      console.log('✅ Brands uploaded:', data?.length || 0);
    }
  };

upload();