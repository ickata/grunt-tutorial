describe('API', function () {
   it('Has working getter', function () {
      expect( API.get() ).toEqual( 0 );
   });
   it('Has working setter', function () {
      var value = 1;
      API.set( value );
      expect( API.get() ).toEqual( value );
   });
});