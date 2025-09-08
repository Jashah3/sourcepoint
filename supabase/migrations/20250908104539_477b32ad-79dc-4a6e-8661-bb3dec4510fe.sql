-- Fix Diet Tracker table RLS policies
CREATE POLICY "Users can view their own diet tracker data" 
ON "Diet Tracker" 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own diet tracker data" 
ON "Diet Tracker" 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own diet tracker data" 
ON "Diet Tracker" 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own diet tracker data" 
ON "Diet Tracker" 
FOR DELETE 
USING (auth.uid() IS NOT NULL);