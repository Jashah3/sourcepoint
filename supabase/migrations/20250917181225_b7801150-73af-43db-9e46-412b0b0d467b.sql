-- Add missing UPDATE and DELETE policies for health_data table
-- These policies ensure users can only modify their own health data

CREATE POLICY "Users can update their own health data" 
ON public.health_data 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health data" 
ON public.health_data 
FOR DELETE 
USING (auth.uid() = user_id);